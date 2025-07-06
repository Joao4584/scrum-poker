import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';

import { ValidationRequestPipe } from '@/shared/pipes/validation-request.pipe';
import { AppModule } from './app.module';
import { corsConfig } from '@/config/cors';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsConfig);
  app.useGlobalPipes(new ValidationRequestPipe());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
