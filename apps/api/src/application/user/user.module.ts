import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import { RegisterIntegrationUserController } from '../../presentation/controllers/user/auth-user.controller';
import { LoadUserIntegrationUseCase } from './load-user-integration.use-case';
import { UsersRepository } from '../../infrastructure/repositories/user.repository';
import { CreateJwtUserUseCase } from './create-jwt-user.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../infrastructure/entities/user.entity';
import { UlidModule } from '@/shared/ulid/ulid.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UlidModule],
  providers: [
    UsersRepository,
    CreateUserUseCase,
    LoadUserIntegrationUseCase,
    CreateJwtUserUseCase,
  ],
  controllers: [RegisterIntegrationUserController],
  exports: [UsersRepository],
})
export class UserModule {}
