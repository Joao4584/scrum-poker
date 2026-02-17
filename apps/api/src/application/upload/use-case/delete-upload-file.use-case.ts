import { Inject, Injectable } from '@nestjs/common';
import { AppErrors } from '@/presentation/errors';
import { UploadFileTypeOrmRepository } from '@/infrastructure/repositories/upload-file.repository';
import { UploadStorage } from '../contracts/upload-storage.interface';
import { UPLOAD_STORAGE } from '../contracts/upload.tokens';

@Injectable()
export class DeleteUploadFileUseCase {
  constructor(
    private readonly uploadFileRepository: UploadFileTypeOrmRepository,
    @Inject(UPLOAD_STORAGE)
    private readonly uploadStorage: UploadStorage,
  ) {}

  async execute(public_id: string): Promise<void> {
    const uploadFile = await this.uploadFileRepository.findByPublicId(public_id);

    if (!uploadFile) {
      throw AppErrors.notFound('Arquivo nao encontrado');
    }

    await this.uploadStorage.deleteFile(uploadFile.url).catch(() => null);

    await this.uploadFileRepository.softDeleteByPublicId(public_id);
  }
}
