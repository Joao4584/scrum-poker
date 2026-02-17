import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { GetUploadFilesByRoomPublicIdUseCase } from '@/application/upload/use-case/get-upload-files-by-room-public-id.use-case';
import { Room } from '@/infrastructure/entities/room.entity';
import { createEntityByPublicIdPipe } from '@/shared/pipes/entity-by-public-id.pipe';

const RoomByPublicIdPipe = createEntityByPublicIdPipe(Room, {
  entityLabel: 'Sala',
});

@ApiTags('Uploads')
@Controller('upload')
export class ListUploadByRoomController {
  constructor(private readonly getUploadFilesByRoomPublicIdUseCase: GetUploadFilesByRoomPublicIdUseCase) {}

  @Get('room/:room_public_id')
  @ApiOperation({ summary: 'Lista uploads por room public_id' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        data: [
          {
            public_id: '01JWC2X9GGT4M8P2GKAQA44B9W',
            room_public_id: '01JWC2X9GGT4M8P2GKAQA44B9W',
            type: 'image/png',
            url: 'http://localhost:4000/upload/file/01JWC2X9GGT4M8P2GKAQA44B9W.png',
            created_at: '2026-02-14T10:00:00.000Z',
          },
        ],
      },
    },
  })
  async listByRoomPublicId(@Param('room_public_id', RoomByPublicIdPipe) room: Room, @Req() req: FastifyRequest) {
    const files = await this.getUploadFilesByRoomPublicIdUseCase.execute(room.public_id);
    const host = req.headers.host;
    const protocol = req.protocol;

    return {
      data: files.map((file) => {
        const isAbsoluteUrl = /^https?:\/\//i.test(file.url);
        const absoluteUrl = isAbsoluteUrl || !host ? file.url : `${protocol}://${host}${file.url}`;
        return {
          public_id: file.public_id,
          room_public_id: file.room?.public_id ?? null,
          type: file.type,
          url: absoluteUrl,
          created_at: file.created_at,
        };
      }),
    };
  }
}
