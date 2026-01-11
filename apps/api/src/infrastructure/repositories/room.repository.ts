import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';
import { RoomParticipant } from '../entities/room-participant.entity';
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
    options: {
      order?: 'ASC' | 'DESC';
      sort?: 'recent' | 'alphabetical' | 'players';
      owner_only?: boolean;
    },
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
    query.loadRelationCountAndMap(
      'room.is_favorite',
      'room.favorites',
      'favorites',
      (favoritesQuery) =>
        favoritesQuery.andWhere('favorites.user_id = :user_id', { user_id }),
    );

    if (options.sort === 'players') {
      query.addSelect(
        (subQuery) =>
          subQuery
            .select('COUNT(participant.id)', 'participants_count')
            .from(RoomParticipant, 'participant')
            .where('participant.room_id = room.id'),
        'participants_count',
      );
      query.orderBy('participants_count', 'DESC');
    } else if (options.sort === 'alphabetical') {
      query.orderBy('room.name', 'ASC');
    } else if (options.sort === 'recent') {
      query.orderBy('room.created_at', 'DESC');
    } else if (options.order) {
      query.orderBy('room.created_at', options.order);
    }

    const rooms = await query.getMany();
    return rooms;
  }
}
