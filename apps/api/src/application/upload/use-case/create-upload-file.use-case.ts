import { Inject, Injectable } from '@nestjs/common';
import { extname } from 'path';
import { UlidService } from '@/shared/ulid/ulid.service';
import { UploadFile } from '@/infrastructure/entities/upload-file.entity';
import { UploadFileTypeOrmRepository } from '@/infrastructure/repositories/upload-file.repository';
import { AppErrors } from '@/presentation/errors';
import { getExtensionFromMimeType } from '../upload-file.helpers';
import { UploadStorage } from '../contracts/upload-storage.interface';
import { UPLOAD_STORAGE } from '../contracts/upload.tokens';

const SNAPSHOT_REUSE_WINDOW_MS = 4 * 60 * 1000;

export interface CreateUploadFileInput {
  buffer: Buffer;
  original_name: string;
  mime_type: string;
  room_id?: number | null;
}

@Injectable()
export class CreateUploadFileUseCase {
  constructor(
    private readonly uploadFileRepository: UploadFileTypeOrmRepository,
    @Inject(UPLOAD_STORAGE)
    private readonly uploadStorage: UploadStorage,
    private readonly ulidService: UlidService,
  ) {}

  async execute(data: CreateUploadFileInput): Promise<UploadFile> {
    if (!data.mime_type?.startsWith('image/')) {
      throw AppErrors.badRequest('Apenas arquivos de imagem sao permitidos');
    }

    const roomId = data.room_id ?? null;
    if (roomId) {
      const latestRoomSnapshot = await this.uploadFileRepository.findLatestByRoomId(roomId);

      if (latestRoomSnapshot) {
        const elapsedMs = Date.now() - latestRoomSnapshot.created_at.getTime();

        if (elapsedMs <= SNAPSHOT_REUSE_WINDOW_MS) {
          return latestRoomSnapshot;
        }

        await this.uploadStorage.deleteFile(latestRoomSnapshot.url).catch(() => null);
        await this.uploadFileRepository.softDeleteByPublicId(latestRoomSnapshot.public_id);
      }
    }

    const publicId = this.ulidService.generateId();
    const extensionFromName = extname(data.original_name || '');
    const extensionFromMime = getExtensionFromMimeType(data.mime_type);
    const extension = extensionFromName || extensionFromMime || '.bin';
    const fileName = `${publicId}${extension.toLowerCase()}`;
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
        room_id: roomId,
      });
    } catch (error) {
      await this.uploadStorage.deleteFile(storedFile.url).catch(() => null);
      throw error;
    }
  }
}
