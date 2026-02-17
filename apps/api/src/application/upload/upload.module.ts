import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadFile } from '@/infrastructure/entities/upload-file.entity';
import { CreateUploadFileUseCase } from '@/application/upload/use-case/create-upload-file.use-case';
import { DeleteUploadFileUseCase } from '@/application/upload/use-case/delete-upload-file.use-case';
import { UlidModule } from '@/shared/ulid/ulid.module';
import { GetUploadFileContentUseCase } from '@/application/upload/use-case/get-upload-file-content.use-case';
import { GetUploadFilesByRoomPublicIdUseCase } from '@/application/upload/use-case/get-upload-files-by-room-public-id.use-case';
import { uploadProviders } from '@/infrastructure/providers/upload.providers';
import { PublicIdEntityResolverService } from '@/shared/services/public-id-entity-resolver.service';
import { CreateUploadMultipartPipe } from '@/shared/pipes/create-upload-multipart.pipe';
import { CreateUploadController } from '@/presentation/controllers/upload/create-upload.controller';
import { DeleteUploadController } from '@/presentation/controllers/upload/delete-upload.controller';
import { GetUploadFileController } from '@/presentation/controllers/upload/get-upload-file.controller';
import { ListUploadByRoomController } from '@/presentation/controllers/upload/list-upload-by-room.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UploadFile]), UlidModule],
  providers: [
    ...uploadProviders,
    PublicIdEntityResolverService,
    CreateUploadMultipartPipe,
    CreateUploadFileUseCase,
    DeleteUploadFileUseCase,
    GetUploadFileContentUseCase,
    GetUploadFilesByRoomPublicIdUseCase,
  ],
  controllers: [CreateUploadController, DeleteUploadController, GetUploadFileController, ListUploadByRoomController],
})
export class UploadModule {}
