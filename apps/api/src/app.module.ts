import {
  Module,
  RequestMethod,
  type MiddlewareConsumer,
  type NestModule,
} from '@nestjs/common';

import { JwtAuthMiddleware } from './presentation/middleware/jwt-auth.middleware';
import { LoggingMiddleware } from './presentation/middleware/logging.middleware';
import { UserModule } from './application/user/user.module';
import { TypeOrmConfigModule } from './shared/typeorm/typeorm.module';

@Module({
  imports: [UserModule, TypeOrmConfigModule],
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
