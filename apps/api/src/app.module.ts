import {
  Module,
  RequestMethod,
  type MiddlewareConsumer,
  type NestModule,
} from '@nestjs/common';
import { PrismaModule } from 'infrastructure/database/prisma.module';
import { JwtAuthMiddleware } from 'modules/shared/middleware/jwt-auth.middleware';
import { LoggingMiddleware } from 'modules/shared/middleware/logging.middleware';
import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [UserModule, PrismaModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');

    consumer
      .apply(JwtAuthMiddleware)
      .exclude({ path: 'user/integration', method: RequestMethod.POST })
      .forRoutes('*');
  }
}
