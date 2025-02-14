import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './useCases/create-user';
import { RegisterIntegrationUserController } from './controllers/auth-user.controller';
import { LoadUserIntegrationUseCase } from './useCases/load-user-integration';
import { UsersRepository } from './repositories/users.repo';
import { PrismaModule } from 'infrastructure/database/prisma.module';
import { CreateJwtUserUseCase } from './useCases/create-jwt-user';

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
