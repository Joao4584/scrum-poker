import { Provider } from '@nestjs/common';
import { env } from '@scrum-poker/env';
import { UploadFileTypeOrmRepository } from '@/infrastructure/repositories/upload-file.repository';
import { FileSystemUploadStorage } from '@/infrastructure/models/storage/file-system-upload-storage';
import { S3UploadStorage } from '@/infrastructure/models/storage/s3-upload-storage';
import { UPLOAD_FILE_REPOSITORY, UPLOAD_STORAGE } from '@/application/upload/contracts/upload.tokens';
import { UploadStorageProvider } from '@/application/upload/contracts/upload-storage-provider.enum';

export const uploadProviders: Provider[] = [
  UploadFileTypeOrmRepository,
  {
    provide: UPLOAD_FILE_REPOSITORY,
    useExisting: UploadFileTypeOrmRepository,
  },
  FileSystemUploadStorage,
  S3UploadStorage,
  {
    provide: UPLOAD_STORAGE,
    useFactory: (
      fileSystemUploadStorage: FileSystemUploadStorage,
      s3UploadStorage: S3UploadStorage,
    ) => {
      if (env.UPLOAD_STORAGE_PROVIDER === UploadStorageProvider.S3) {
        return s3UploadStorage;
      }
      return fileSystemUploadStorage;
    },
    inject: [FileSystemUploadStorage, S3UploadStorage],
  },
];
