import { Inject, Injectable } from '@nestjs/common';
import { extname } from 'path';
import { UlidService } from '@/shared/ulid/ulid.service';
import { UploadFile } from '@/infrastructure/entities/upload-file.entity';
import { AppErrors } from '@/presentation/errors';
import { buildUploadFileName, getExtensionFromMimeType } from '../upload-file.helpers';
import {
  UploadFileRepository,
} from '../contracts/upload-file-repository.interface';
import { UploadStorage } from '../contracts/upload-storage.interface';
import { UPLOAD_FILE_REPOSITORY, UPLOAD_STORAGE } from '../contracts/upload.tokens';

export interface CreateUploadFileInput {
  buffer: Buffer;
  original_name: string;
  mime_type: string;
  room_id?: number | null;
}

@Injectable()
export class CreateUploadFileUseCase {
  constructor(
    @Inject(UPLOAD_FILE_REPOSITORY)
    private readonly uploadFileRepository: UploadFileRepository,
    @Inject(UPLOAD_STORAGE)
    private readonly uploadStorage: UploadStorage,
    private readonly ulidService: UlidService,
  ) {}

  async execute(data: CreateUploadFileInput): Promise<UploadFile> {
    if (!data.mime_type?.startsWith('image/')) {
      throw AppErrors.badRequest('Apenas arquivos de imagem sao permitidos');
    }

    const publicId = this.ulidService.generateId();
    const extensionFromName = extname(data.original_name || '');
    const extensionFromMime = getExtensionFromMimeType(data.mime_type);
    const extension = extensionFromName || extensionFromMime || '.bin';
    const fileName = buildUploadFileName(data.original_name, extension);
    const storedFile = await this.uploadStorage.saveFile({
      file_name: fileName,
      mime_type: data.mime_type,
      buffer: data.buffer,
    });

    try {
      return await this.uploadFileRepository.create({
        public_id: publicId,
        url: storedFile.url,
        type: data.mime_type,
        room_id: data.room_id ?? null,
      });
    } catch (error) {
      await this.uploadStorage.deleteFile(storedFile.url).catch(() => null);
      throw error;
    }
  }
}
