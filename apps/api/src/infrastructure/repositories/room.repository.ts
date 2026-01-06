import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';
import { VotingScale } from '@/shared/enums/voting-scale.enum';
export interface CreateRoomInput {
  public_id: string;
  name: string;
  description?: string | null;
  owner_id: number;
  is_public: boolean;
  voting_scale?: VotingScale | null;
  status?: string;
  password?: string | null;
}

@Injectable()
export class RoomTypeOrmRepository {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async create(data: CreateRoomInput): Promise<Room> {
    const newRoom = this.roomRepository.create({
      ...data,
      status: data.status ?? 'open',
    });
    const saved = await this.roomRepository.save(newRoom);
    return saved;
  }

  async findByPublicId(public_id: string): Promise<Room | null> {
    const room = await this.roomRepository.findOne({
      where: { public_id },
    });
    return room;
  }

  async deleteByPublicId(public_id: string): Promise<void> {
    await this.roomRepository.softDelete({ public_id });
  }

  async findRecentByUserId(
    user_id: number,
    options: { order?: 'ASC' | 'DESC'; owner_only?: boolean },
  ): Promise<Room[]> {
    const query = this.roomRepository.createQueryBuilder('room');
    query.select([
      'room.public_id',
      'room.name',
      'room.description',
      'room.is_public',
      'room.voting_scale',
      'room.status',
      'room.created_at',
      'room.updated_at',
    ]);

    if (options.owner_only) {
      query.where('room.owner_id = :user_id', { user_id });
    } else {
      query
        .leftJoin('room.participants', 'participants')
        .where('room.owner_id = :user_id', { user_id })
        .orWhere('participants.user_id = :user_id', { user_id });
    }

    query.loadRelationCountAndMap('room.participants_count', 'room.participants');

    if (options.order) {
      query.orderBy('room.created_at', options.order);
    }

    const rooms = await query.getMany();
    return rooms;
  }
}
