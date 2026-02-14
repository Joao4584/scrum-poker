import { Inject, Injectable } from '@nestjs/common';
import { basename } from 'path';
import { AppErrors } from '@/presentation/errors';
import {
  UploadFileRepository,
} from '../contracts/upload-file-repository.interface';
import { UploadStorage } from '../contracts/upload-storage.interface';
import { UPLOAD_FILE_REPOSITORY, UPLOAD_STORAGE } from '../contracts/upload.tokens';

export interface UploadFileContentOutput {
  type: string;
  buffer: Buffer;
}

@Injectable()
export class GetUploadFileContentUseCase {
  constructor(
    @Inject(UPLOAD_FILE_REPOSITORY)
    private readonly uploadFileRepository: UploadFileRepository,
    @Inject(UPLOAD_STORAGE)
    private readonly uploadStorage: UploadStorage,
  ) {}

  async execute(fileName: string): Promise<UploadFileContentOutput> {
    const safeFileName = basename(fileName);
    const publicId = safeFileName.split('.')[0];

    if (!publicId) {
      throw AppErrors.notFound('Arquivo nao encontrado');
    }

    const uploadFile = await this.uploadFileRepository.findByPublicId(publicId);

    if (!uploadFile) {
      throw AppErrors.notFound('Arquivo nao encontrado');
    }

    const buffer = await this.uploadStorage.getFile(uploadFile.url).catch(() => {
      throw AppErrors.notFound('Arquivo nao encontrado');
    });

    return {
      type: uploadFile.type,
      buffer,
    };
  }
}
