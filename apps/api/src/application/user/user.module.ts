import { Module, forwardRef } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import { RegisterIntegrationUserController } from '../../presentation/controllers/user/auth-user.controller';
import { LoadUserIntegrationUseCase } from './load-user-integration.use-case';
import { UserTypeOrmRepository } from '../../infrastructure/repositories/user.repository';
import { CreateJwtUserUseCase } from './create-jwt-user.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../infrastructure/entities/user.entity';
import { UlidModule } from '@/shared/ulid/ulid.module';
import { GetUserController } from '@/presentation/controllers/user/get-user.controller';
import { SearchUserController } from '@/presentation/controllers/user/search-user.controller';
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
  ],
  controllers: [RegisterIntegrationUserController, GetUserController, SearchUserController],
  exports: [UserTypeOrmRepository],
})
export class UserModule {}
