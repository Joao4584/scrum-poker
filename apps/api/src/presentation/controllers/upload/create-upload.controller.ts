import { Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { CreateUploadFileUseCase } from '@/application/upload/use-case/create-upload-file.use-case';
import { MultipartBody } from '@/presentation/decorators/multipart-body.decorator';
import { CreateUploadPayload } from '@/presentation/requests/upload/create-upload.payload';
import { CreateUploadMultipartPipe } from '@/shared/pipes/create-upload-multipart.pipe';

@ApiTags('Uploads')
@Controller('upload')
export class CreateUploadController {
  constructor(private readonly createUploadFileUseCase: CreateUploadFileUseCase) {}

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
  async upload(@MultipartBody(CreateUploadMultipartPipe) payload: CreateUploadPayload, @Req() req: FastifyRequest) {
    const uploaded = await this.createUploadFileUseCase.execute(payload);

    const host = req.headers.host;
    const protocol = req.protocol;
    const isAbsoluteUrl = /^https?:\/\//i.test(uploaded.url);
    const absoluteUrl = isAbsoluteUrl || !host ? uploaded.url : `${protocol}://${host}${uploaded.url}`;

    return {
      public_id: uploaded.public_id,
      room_public_id: payload.room_public_id,
      url: absoluteUrl,
    };
  }
}
