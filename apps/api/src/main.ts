import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';

import { ValidationRequestPipe } from 'modules/shared/pipe/validation-request.pipe';
import { AppModule } from 'app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationRequestPipe());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
