import { Module, forwardRef } from '@nestjs/common';
import { CreateUserUseCase } from './use-case/create-user.use-case';
import { RegisterIntegrationUserController } from '../../presentation/controllers/user/auth-user.controller';
import { LoadUserIntegrationUseCase } from './use-case/load-user-integration.use-case';
import { UserTypeOrmRepository } from '../../infrastructure/repositories/user.repository';
import { CreateJwtUserUseCase } from './use-case/create-jwt-user.use-case';
import { AddUserXpUseCase } from './use-case/add-user-xp.use-case';
import { GetPublicUserInfoUseCase } from './use-case/get-public-user-info.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../infrastructure/entities/user.entity';
import { UlidModule } from '@/shared/ulid/ulid.module';
import { GetUserController } from '@/presentation/controllers/user/get-user.controller';
import { SearchUserController } from '@/presentation/controllers/user/search-user.controller';
import { GetPublicUserInfoController } from '@/presentation/controllers/user/get-public-user-info.controller';
import { FriendModule } from '@/application/friend/friend.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UlidModule,
    forwardRef(() => FriendModule),
  ],
  providers: [
    UserTypeOrmRepository,
    CreateUserUseCase,
    LoadUserIntegrationUseCase,
    CreateJwtUserUseCase,
    AddUserXpUseCase,
    GetPublicUserInfoUseCase,
  ],
  controllers: [
    RegisterIntegrationUserController,
    GetUserController,
    SearchUserController,
    GetPublicUserInfoController,
  ],
  exports: [UserTypeOrmRepository],
})
export class UserModule {}
