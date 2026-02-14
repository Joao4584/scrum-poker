import { Injectable } from '@nestjs/common';
import { basename, join } from 'path';
import { mkdir, readFile, unlink, writeFile } from 'fs/promises';
import {
  StoreUploadFileInput,
  StoreUploadFileOutput,
  UploadStorage,
} from '@/application/upload/contracts/upload-storage.interface';
import { getUploadDirectory } from '@/application/upload/upload-path';

@Injectable()
export class FileSystemUploadStorage implements UploadStorage {
  async saveFile(input: StoreUploadFileInput): Promise<StoreUploadFileOutput> {
    const uploadDir = getUploadDirectory();
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, input.file_name);
    await writeFile(filePath, input.buffer);

    return { url: `/upload/file/${input.file_name}` };
  }

  async deleteFile(url: string): Promise<void> {
    const uploadDir = getUploadDirectory();
    const fileName = basename(url || '');
    if (!fileName) {
      return;
    }

    await unlink(join(uploadDir, fileName)).catch(() => null);
  }

  async getFile(url: string): Promise<Buffer> {
    const uploadDir = getUploadDirectory();
    const fileName = basename(url || '');
    if (!fileName) {
      throw new Error('FILE_NOT_FOUND');
    }

    return await readFile(join(uploadDir, fileName));
  }
}
