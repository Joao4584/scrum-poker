import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadFile } from '@/infrastructure/entities/upload-file.entity';
import { CreateUploadFileUseCase } from '@/application/upload/use-case/create-upload-file.use-case';
import { DeleteUploadFileUseCase } from '@/application/upload/use-case/delete-upload-file.use-case';
import { UploadController } from '@/presentation/controllers/upload/upload.controller';
import { UlidModule } from '@/shared/ulid/ulid.module';
import { GetUploadFileContentUseCase } from '@/application/upload/use-case/get-upload-file-content.use-case';
import { uploadProviders } from '@/infrastructure/providers/upload.providers';

@Module({
  imports: [TypeOrmModule.forFeature([UploadFile]), UlidModule],
  providers: [
    ...uploadProviders,
    CreateUploadFileUseCase,
    DeleteUploadFileUseCase,
    GetUploadFileContentUseCase,
  ],
  controllers: [UploadController],
})
export class UploadModule {}
