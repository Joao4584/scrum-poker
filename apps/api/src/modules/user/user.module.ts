import {
  Module,
  type MiddlewareConsumer,
  type NestModule,
} from '@nestjs/common';

import { RegisterUserController } from './controllers/register-user.controller';
import { LoadUserService } from './services/load-users.service';
// import { CaptchaValidationMiddleware } from 'modules/common/middleware/captcha-validation.middleware';

@Module({
  imports: [],
  controllers: [RegisterUserController],
  providers: [LoadUserService],
})
export class UserModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(CaptchaValidationMiddleware).forRoutes('user');
  // }
}
