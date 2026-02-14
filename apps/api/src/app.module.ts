import {
  Module,
  RequestMethod,
  type MiddlewareConsumer,
  type NestModule,
} from '@nestjs/common';
import { JwtAuthMiddleware } from './presentation/middleware/jwt-auth.middleware';
import { LoggingMiddleware } from './presentation/middleware/logging.middleware';
import { UserModule } from './application/user/user.module';
import { RoomModule } from './application/room/room.module';
import { FriendModule } from './application/friend/friend.module';
import { UploadModule } from './application/upload/upload.module';
import { TypeOrmConfigModule } from './shared/typeorm/typeorm.module';
import { PingController } from './presentation/controllers/ping.controller';
import { SwaggerController } from './presentation/controllers/swagger.controller';
import { DashboardGateway } from './presentation/gateways/dashboard/dashboard.gateway';

@Module({
  imports: [UserModule, RoomModule, FriendModule, UploadModule, TypeOrmConfigModule],
  controllers: [PingController, SwaggerController],
  providers: [DashboardGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
    consumer
      .apply(JwtAuthMiddleware)
      .exclude(
        { path: 'user/integration', method: RequestMethod.POST },
        { path: 'docs', method: RequestMethod.GET },
        { path: 'docs/(.*)', method: RequestMethod.GET },
        { path: 'docs-json', method: RequestMethod.GET },
        { path: 'upload/file/(.*)', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}

