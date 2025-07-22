// import {
//   Controller,
//   Get,
//   Param,
//   Post,
//   Res,
//   UploadedFile,
//   UseInterceptors,
// } from '@nestjs/common';
// // import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';

// @Controller('files')
// export class FilesController {
//   @Post('upload')
//   @UseInterceptors()
//   uploadFile(@UploadedFile() file: any) {
//     return { url: `/files/${file.filename}` };
//   }

//   @Get(':filename')
//   getFile(@Param('filename') filename: string, @Res() res) {
//     return res.sendFile(filename, { root: './uploads' });
//   }
// }
