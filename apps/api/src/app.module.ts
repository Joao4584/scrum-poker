import {
  Module,
  type MiddlewareConsumer,
  type NestModule,
} from '@nestjs/common';
import { PrismaModule } from 'infrastructure/database/prisma.module';
import { LoggingMiddleware } from 'modules/shared/middleware/logging.middleware';
import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [UserModule, PrismaModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
