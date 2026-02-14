import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { WsAdapter } from '@nestjs/platform-ws';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import chalk from 'chalk';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';

import { ValidationRequestPipe } from '@/shared/pipes/validation-request.pipe';
import { AppModule } from './app.module';
import { CustomLogger } from '@/config/logger';
import { corsConfig } from '@/config/cors';

import { env } from '@scrum-poker/env';

async function bootstrap() {
  const logger = new CustomLogger('API');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger },
  );
  app.useLogger(logger);

  app.enableCors(corsConfig);
  await app.register(fastifyCookie as any);
  await app.register(fastifyMultipart as any);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalPipes(new ValidationRequestPipe());
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Scrum Poker API')
    .setDescription('API docs for Scrum Poker backend')
    .setVersion('1.0')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Health', 'Health check endpoints')
    .addTag('User', 'User profile endpoints')
    .addTag('Rooms', 'Rooms management')
    .addTag('Friends', 'Friendship requests and connections')
    .addTag('Questions', 'Questions in rooms')
    .addTag('Votes', 'Voting endpoints')
    .addTag('Uploads', 'Upload endpoints')
    .addBearerAuth()
    .addCookieAuth('meta-session')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      withCredentials: true,
    },
    customJs: ['/docs/login.js'],
  });
  const port = env.PORT_NEST ?? 3000;
  await app.listen(port, '0.0.0.0');
  const appUrl = await app.getUrl();
  console.log(`Application is running on: ${appUrl}`);
  console.log(chalk.cyanBright(`Swagger docs: ${appUrl}/docs`));
}
bootstrap();

