import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import { RegisterIntegrationUserController } from '../../presentation/controllers/user/auth-user.controller';
import { LoadUserIntegrationUseCase } from './load-user-integration.use-case';
import { UserTypeOrmRepository } from '../../infrastructure/repositories/user.repository';
import { CreateJwtUserUseCase } from './create-jwt-user.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../infrastructure/entities/user.entity';
import { UlidModule } from '@/shared/ulid/ulid.module';
import { USER_REPOSITORY } from '@/domain/user/user.repository';
import { GetUserController } from '@/presentation/controllers/user/get-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UlidModule],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
    CreateUserUseCase,
    LoadUserIntegrationUseCase,
    CreateJwtUserUseCase,
  ],
  controllers: [RegisterIntegrationUserController, GetUserController],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
