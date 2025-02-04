import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './useCases/create-user';
import { RegisterIntegrationUserController } from './controllers/auth-user.controller';

@Module({
  providers: [CreateUserUseCase],
  controllers: [RegisterIntegrationUserController],
})
export class UserModule {}
