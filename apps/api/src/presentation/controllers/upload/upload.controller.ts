import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Multipart, MultipartFile } from '@fastify/multipart';
import { CreateUploadFileUseCase } from '@/application/upload/use-case/create-upload-file.use-case';
import { DeleteUploadFileUseCase } from '@/application/upload/use-case/delete-upload-file.use-case';
import { AppErrors } from '@/presentation/errors';
import { GetUploadFileContentUseCase } from '@/application/upload/use-case/get-upload-file-content.use-case';
import { GetUploadFilesByRoomPublicIdUseCase } from '@/application/upload/use-case/get-upload-files-by-room-public-id.use-case';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';

type MultipartFastifyRequest = FastifyRequest & {
  file: () => Promise<MultipartFile | undefined>;
};

@ApiTags('Uploads')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly createUploadFileUseCase: CreateUploadFileUseCase,
    private readonly deleteUploadFileUseCase: DeleteUploadFileUseCase,
    private readonly getUploadFileContentUseCase: GetUploadFileContentUseCase,
    private readonly getUploadFilesByRoomPublicIdUseCase: GetUploadFilesByRoomPublicIdUseCase,
    private readonly roomRepository: RoomTypeOrmRepository,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload de imagem' })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        public_id: '01JWC2X9GGT4M8P2GKAQA44B9W',
        room_public_id: '01JWC2X9GGT4M8P2GKAQA44B9W',
        url: 'http://localhost:4000/upload/file/01JWC2X9GGT4M8P2GKAQA44B9W.png',
      },
    },
  })
  async upload(@Req() req: FastifyRequest) {
    const multipartRequest = req as MultipartFastifyRequest;
    const file = await multipartRequest.file();

    if (!file) {
      throw AppErrors.badRequest('Arquivo nao enviado');
    }

    const roomReference = await this.parseRoomReference(file);
    const uploaded = await this.createUploadFileUseCase.execute({
      buffer: await file.toBuffer(),
      original_name: file.filename,
      mime_type: file.mimetype,
      room_id: roomReference.room_id,
    });

    const host = req.headers.host;
    const protocol = req.protocol;
    const isAbsoluteUrl = /^https?:\/\//i.test(uploaded.url);
    const absoluteUrl = isAbsoluteUrl || !host ? uploaded.url : `${protocol}://${host}${uploaded.url}`;

    return {
      public_id: uploaded.public_id,
      room_public_id: roomReference.room_public_id,
      url: absoluteUrl,
    };
  }

  @Delete(':public_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deleta upload de imagem por public_id' })
  @ApiResponse({ status: 204 })
  async delete(@Param('public_id') public_id: string) {
    await this.deleteUploadFileUseCase.execute(public_id);
  }

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
  async listByRoomPublicId(@Param('room_public_id') roomPublicId: string, @Req() req: FastifyRequest) {
    const files = await this.getUploadFilesByRoomPublicIdUseCase.execute(roomPublicId);
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

  @HttpCode(HttpStatus.OK)
  @Get('file/:filename')
  @ApiOperation({ summary: 'Retorna imagem de upload por URL publica' })
  @ApiResponse({ status: 200, description: 'Conteudo da imagem' })
  @ApiResponse({ status: 404, description: 'Arquivo nao encontrado' })
  async getFile(@Param('filename') fileName: string, @Res() reply: FastifyReply) {
    const file = await this.getUploadFileContentUseCase.execute(fileName);
    reply.header('Content-Type', file.type);
    return reply.send(file.buffer);
  }

  private async parseRoomReference(file: MultipartFile): Promise<{
    room_id: number | null;
    room_public_id: string | null;
  }> {
    const roomId = this.parseRoomId(file);
    const roomPublicId = this.parseRoomPublicId(file);

    if (roomId !== null) {
      return {
        room_id: roomId,
        room_public_id: roomPublicId,
      };
    }

    if (!roomPublicId) {
      return {
        room_id: null,
        room_public_id: null,
      };
    }

    const room = await this.roomRepository.findByPublicId(roomPublicId);

    if (!room) {
      throw AppErrors.badRequest('room_public_id nao encontrado');
    }

    return {
      room_id: room.id,
      room_public_id: room.public_id,
    };
  }

  private parseRoomId(file: MultipartFile): number | null {
    const value = this.parseFieldValue(file, 'room_id');

    if (value === null) {
      return null;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw AppErrors.badRequest('room_id deve ser um numero inteiro positivo');
    }

    return parsed;
  }

  private parseRoomPublicId(file: MultipartFile): string | null {
    const value = this.parseFieldValue(file, 'room_public_id');

    if (value === null) {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private parseFieldValue(file: MultipartFile, fieldName: string): string | null {
    const field = file.fields?.[fieldName];

    if (!field) {
      return null;
    }

    const firstField = Array.isArray(field) ? field[0] : field;
    const value = firstField && this.isMultipartField(firstField) ? firstField.value : null;

    if (value === undefined || value === null || value === '') {
      return null;
    }

    return String(value);
  }

  private isMultipartField(part: Multipart): part is Extract<Multipart, { type: 'field' }> {
    return part.type === 'field';
  }
}
