import { Inject, Injectable } from '@nestjs/common';
import { UploadFileRepository } from '../contracts/upload-file-repository.interface';
import { UPLOAD_FILE_REPOSITORY } from '../contracts/upload.tokens';

@Injectable()
export class GetUploadFilesByRoomPublicIdUseCase {
  constructor(
    @Inject(UPLOAD_FILE_REPOSITORY)
    private readonly uploadFileRepository: UploadFileRepository,
  ) {}

  async execute(room_public_id: string) {
    return await this.uploadFileRepository.findByRoomPublicId(room_public_id);
  }
}
