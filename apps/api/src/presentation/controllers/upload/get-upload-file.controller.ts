import { Controller, Get, HttpCode, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { GetUploadFileContentUseCase } from '@/application/upload/use-case/get-upload-file-content.use-case';

@ApiTags('Uploads')
@Controller('upload')
export class GetUploadFileController {
  constructor(private readonly getUploadFileContentUseCase: GetUploadFileContentUseCase) {}

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
}
