import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UploadFile } from '@/infrastructure/entities/upload-file.entity';
import {
  CreateUploadFileRecordInput,
  UploadFileRepository,
} from '@/application/upload/contracts/upload-file-repository.interface';

@Injectable()
export class UploadFileTypeOrmRepository implements UploadFileRepository {
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

  async softDeleteByPublicId(public_id: string): Promise<void> {
    await this.repository.softDelete({ public_id });
  }
}
