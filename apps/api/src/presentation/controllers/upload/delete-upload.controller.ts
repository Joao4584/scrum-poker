import { Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteUploadFileUseCase } from '@/application/upload/use-case/delete-upload-file.use-case';

@ApiTags('Uploads')
@Controller('upload')
export class DeleteUploadController {
  constructor(private readonly deleteUploadFileUseCase: DeleteUploadFileUseCase) {}

  @Delete(':public_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deleta upload de imagem por public_id' })
  @ApiResponse({ status: 204 })
  async delete(@Param('public_id') public_id: string) {
    await this.deleteUploadFileUseCase.execute(public_id);
  }
}
