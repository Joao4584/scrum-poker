import { Controller, Get, HttpCode, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { Inject } from '@nestjs/common';
import { Room } from '@/infrastructure/entities/room.entity';
import { UploadFileTypeOrmRepository } from '@/infrastructure/repositories/upload-file.repository';
import { createEntityByPublicIdPipe } from '@/shared/pipes/entity-by-public-id.pipe';
import { AppErrors } from '@/presentation/errors';
import { UploadStorage } from '@/application/upload/contracts/upload-storage.interface';
import { UPLOAD_STORAGE } from '@/application/upload/contracts/upload.tokens';

const RoomByPublicIdPipe = createEntityByPublicIdPipe(Room, {
  entityLabel: 'Sala',
});

@ApiTags('Uploads')
@Controller('upload')
export class GetRoomUploadFileController {
  constructor(
    private readonly uploadFileRepository: UploadFileTypeOrmRepository,
    @Inject(UPLOAD_STORAGE)
    private readonly uploadStorage: UploadStorage,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('room/:room_public_id/file')
  @ApiOperation({ summary: 'Retorna a ultima imagem da sala' })
  @ApiResponse({ status: 200, description: 'Conteudo da imagem da sala' })
  @ApiResponse({ status: 404, description: 'Imagem da sala nao encontrada' })
  async getRoomImage(@Param('room_public_id', RoomByPublicIdPipe) room: Room, @Res() reply: FastifyReply) {
    const latestUpload = await this.uploadFileRepository.findLatestByRoomId(room.id);
    if (!latestUpload) {
      throw AppErrors.notFound('Imagem da sala nao encontrada');
    }

    const buffer = await this.uploadStorage.getFile(latestUpload.url).catch(() => null);
    if (!buffer) {
      throw AppErrors.notFound('Imagem da sala nao encontrada');
    }

    reply.header('Content-Type', latestUpload.type);
    return reply.send(buffer);
  }
}
