import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadFile } from '@/infrastructure/entities/upload-file.entity';
import { Room } from '@/infrastructure/entities/room.entity';
import { CreateUploadFileUseCase } from '@/application/upload/use-case/create-upload-file.use-case';
import { DeleteUploadFileUseCase } from '@/application/upload/use-case/delete-upload-file.use-case';
import { UploadController } from '@/presentation/controllers/upload/upload.controller';
import { UlidModule } from '@/shared/ulid/ulid.module';
import { GetUploadFileContentUseCase } from '@/application/upload/use-case/get-upload-file-content.use-case';
import { GetUploadFilesByRoomPublicIdUseCase } from '@/application/upload/use-case/get-upload-files-by-room-public-id.use-case';
import { uploadProviders } from '@/infrastructure/providers/upload.providers';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UploadFile, Room]), UlidModule],
  providers: [
    ...uploadProviders,
    RoomTypeOrmRepository,
    CreateUploadFileUseCase,
    DeleteUploadFileUseCase,
    GetUploadFileContentUseCase,
    GetUploadFilesByRoomPublicIdUseCase,
  ],
  controllers: [UploadController],
})
export class UploadModule {}
