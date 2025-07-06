import { Module } from '@nestjs/common';
import { CreateUserUseCase } from '@/application/user/create-user.use-case';
import { RegisterIntegrationUserController } from '@/presentation/controllers/user/auth-user.controller';
import { LoadUserIntegrationUseCase } from '@/application/user/load-user-integration.use-case';
import { UsersRepository } from '@/infrastructure/repositories/user.repository';
import { CreateJwtUserUseCase } from '@/application/user/create-jwt-user.use-case';

@Module({
  providers: [
    UsersRepository,
    CreateUserUseCase,
    LoadUserIntegrationUseCase,
    CreateJwtUserUseCase,
  ],
  controllers: [RegisterIntegrationUserController],
})
export class UserModule {}