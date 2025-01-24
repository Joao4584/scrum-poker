import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';

import { GlobalModule } from './app.module';
import { ValidationRequestPipe } from 'modules/common/pipe/validation-request.pipe';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(GlobalModule);

  app.useGlobalPipes(new ValidationRequestPipe());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
