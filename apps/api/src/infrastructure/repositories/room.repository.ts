import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';

@Injectable()
export class RoomsRepository {
  constructor(
    @InjectRepository(Room)
    private readonly room_repository: Repository<Room>,
  ) {}

  async createRoom(data: Partial<Room>): Promise<Room> {
    const newRoom = this.room_repository.create(data);
    return this.room_repository.save(newRoom);
  }

  async findRoomByPublicId(public_id: string): Promise<Room | undefined> {
    return this.room_repository.findOne({
      where: { public_id, deleted_at: null },
    });
  }

  async deleteRoom(public_id: string): Promise<void> {
    await this.room_repository.softDelete({ public_id });
  }

  async findRecentRoomsByUserId(
    user_id: number,
    options: { order?: 'ASC' | 'DESC'; owner_only?: boolean },
  ): Promise<Room[]> {
    const query = this.room_repository.createQueryBuilder('room');

    if (options.owner_only) {
      query.where('room.owner_id = :user_id', { user_id });
    } else {
      query
        .leftJoin('room.participants', 'participants')
        .where('room.owner_id = :user_id', { user_id })
        .orWhere('participants.user_id = :user_id', { user_id });
    }

    query.loadRelationCountAndMap(
      'room.participants_count',
      'room.participants',
    );

    if (options.order) {
      query.orderBy('room.created_at', options.order);
    }

    return query.getMany();
  }
}
