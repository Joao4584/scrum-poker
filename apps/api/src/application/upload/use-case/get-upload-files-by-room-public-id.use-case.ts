import { Injectable } from '@nestjs/common';
import { UploadFileTypeOrmRepository } from '@/infrastructure/repositories/upload-file.repository';

@Injectable()
export class GetUploadFilesByRoomPublicIdUseCase {
  constructor(private readonly uploadFileRepository: UploadFileTypeOrmRepository) {}

  async execute(room_public_id: string) {
    return await this.uploadFileRepository.findByRoomPublicId(room_public_id);
  }
}
