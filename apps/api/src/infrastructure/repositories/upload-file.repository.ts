import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UploadFile } from '@/infrastructure/entities/upload-file.entity';

export interface CreateUploadFileRecordInput {
  public_id: string;
  url: string;
  type: string;
  room_id?: number | null;
}

@Injectable()
export class UploadFileTypeOrmRepository {
  constructor(
    @InjectRepository(UploadFile)
    private readonly repository: Repository<UploadFile>,
  ) {}

  async create(data: CreateUploadFileRecordInput): Promise<UploadFile> {
    const uploadFile = this.repository.create({
      ...data,
      room_id: data.room_id ?? null,
    });
    const saved = await this.repository.save(uploadFile);
    return saved;
  }

  async findByPublicId(public_id: string, includeDeleted = false): Promise<UploadFile | null> {
    const uploadFile = await this.repository.findOne({
      where: { public_id },
      withDeleted: includeDeleted,
    });
    return uploadFile;
  }

  async findLatestByRoomId(room_id: number): Promise<UploadFile | null> {
    return await this.repository.findOne({
      where: { room_id },
      order: { created_at: 'DESC' },
    });
  }

  async findLatestByRoomIds(roomIds: number[]): Promise<UploadFile[]> {
    if (roomIds.length === 0) {
      return [];
    }

    return await this.repository
      .createQueryBuilder('upload_file')
      .where('upload_file.room_id IN (:...roomIds)', { roomIds })
      .distinctOn(['upload_file.room_id'])
      .orderBy('upload_file.room_id', 'ASC')
      .addOrderBy('upload_file.created_at', 'DESC')
      .getMany();
  }

  async findByRoomPublicId(room_public_id: string): Promise<UploadFile[]> {
    return await this.repository
      .createQueryBuilder('upload_file')
      .leftJoinAndSelect('upload_file.room', 'room')
      .where('room.public_id = :room_public_id', { room_public_id })
      .orderBy('upload_file.created_at', 'DESC')
      .getMany();
  }

  async softDeleteByPublicId(public_id: string): Promise<void> {
    await this.repository.softDelete({ public_id });
  }
}
