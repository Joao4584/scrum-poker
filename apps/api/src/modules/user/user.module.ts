import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './useCases/create-user';
import { RegisterIntegrationUserController } from './controllers/auth-user.controller';
import { LoadUserIntegrationUseCase } from './useCases/load-user-integration';
import { UsersRepository } from './repositories/users.repo';
import { PrismaModule } from 'infrastructure/database/prisma.module';

@Module({
  providers: [UsersRepository, CreateUserUseCase, LoadUserIntegrationUseCase],
  controllers: [RegisterIntegrationUserController],
})
export class UserModule {}
