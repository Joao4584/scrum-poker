import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomFavorite } from '@/infrastructure/entities/room-favorite.entity';

export interface CreateRoomFavoriteInput {
  public_id: string;
  user_id: number;
  room_id: number;
}

@Injectable()
export class RoomFavoriteTypeOrmRepository {
  constructor(
    @InjectRepository(RoomFavorite)
    private readonly repository: Repository<RoomFavorite>,
  ) {}

  async create(data: CreateRoomFavoriteInput): Promise<RoomFavorite> {
    const entity = this.repository.create(data);
    const saved = await this.repository.save(entity);
    return saved;
  }

  async findByUserAndRoom(
    user_id: number,
    room_id: number,
  ): Promise<RoomFavorite | null> {
    const favorite = await this.repository.findOne({
      where: { user_id, room_id },
    });
    return favorite;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
