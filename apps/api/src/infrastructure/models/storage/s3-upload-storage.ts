import { Injectable } from '@nestjs/common';
import {
  StoreUploadFileInput,
  StoreUploadFileOutput,
  UploadStorage,
} from '@/application/upload/contracts/upload-storage.interface';
import { AppErrors } from '@/presentation/errors';

@Injectable()
export class S3UploadStorage implements UploadStorage {
  async saveFile(_input: StoreUploadFileInput): Promise<StoreUploadFileOutput> {
    throw AppErrors.internal('S3 upload ainda nao configurado');
  }

  async deleteFile(_url: string): Promise<void> {
    throw AppErrors.internal('S3 delete ainda nao configurado');
  }

  async getFile(_url: string): Promise<Buffer> {
    throw AppErrors.internal('S3 get file ainda nao configurado');
  }
}
