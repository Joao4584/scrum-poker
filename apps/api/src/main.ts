import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { ValidationRequestPipe } from '@/shared/pipes/validation-request.pipe';
import { AppModule } from './app.module';
import { CustomLogger } from '@/config/logger';
import { corsConfig } from '@/config/cors';

import { env } from '@scrum-poker/env';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger: new CustomLogger() },
  );

  app.enableCors(corsConfig);
  app.useGlobalPipes(new ValidationRequestPipe());

  const port = env.PORT_NEST ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
