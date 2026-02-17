import { Controller, Get, HttpCode, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { GetUploadFileContentUseCase } from '@/application/upload/use-case/get-upload-file-content.use-case';

const FALLBACK_IMAGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="450" height="280" viewBox="0 0 450 280">
  <rect width="450" height="280" fill="#eef2f7"/>
  <rect x="16" y="16" width="418" height="248" rx="10" fill="#dfe7f1"/>
  <text x="225" y="146" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#4a5568">
    imagem indisponivel
  </text>
</svg>`;

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
    try {
      const file = await this.getUploadFileContentUseCase.execute(fileName);
      reply.header('Content-Type', file.type);
      return reply.send(file.buffer);
    } catch {
      reply.code(HttpStatus.OK);
      reply.header('Content-Type', 'image/svg+xml');
      return reply.send(FALLBACK_IMAGE_SVG);
    }
  }
}
