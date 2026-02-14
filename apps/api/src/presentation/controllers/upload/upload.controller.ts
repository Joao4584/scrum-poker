import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Multipart, MultipartFile } from '@fastify/multipart';
import { CreateUploadFileUseCase } from '@/application/upload/use-case/create-upload-file.use-case';
import { DeleteUploadFileUseCase } from '@/application/upload/use-case/delete-upload-file.use-case';
import { AppErrors } from '@/presentation/errors';
import { GetUploadFileContentUseCase } from '@/application/upload/use-case/get-upload-file-content.use-case';

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

    const roomId = this.parseRoomId(file);
    const uploaded = await this.createUploadFileUseCase.execute({
      buffer: await file.toBuffer(),
      original_name: file.filename,
      mime_type: file.mimetype,
      room_id: roomId,
    });

    const host = req.headers.host;
    const protocol = req.protocol;
    const isAbsoluteUrl = /^https?:\/\//i.test(uploaded.url);
    const absoluteUrl =
      isAbsoluteUrl || !host ? uploaded.url : `${protocol}://${host}${uploaded.url}`;

    return {
      public_id: uploaded.public_id,
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

  private parseRoomId(file: MultipartFile): number | null {
    const field = file.fields?.['room_id'];

    if (!field) {
      return null;
    }

    const firstField = Array.isArray(field) ? field[0] : field;
    const value =
      firstField && this.isMultipartField(firstField) ? firstField.value : null;

    if (value === undefined || value === null || value === '') {
      return null;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw AppErrors.badRequest('room_id deve ser um numero inteiro positivo');
    }

    return parsed;
  }

  private isMultipartField(part: Multipart): part is Extract<Multipart, { type: 'field' }> {
    return part.type === 'field';
  }
}
