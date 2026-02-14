import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friends } from '@/infrastructure/entities/friends.entity';
import { FriendsTypeOrmRepository } from '@/infrastructure/repositories/friends.repository';
import { FriendController } from '@/presentation/controllers/friend/friend.controller';
import { SendFriendRequestUseCase } from './use-case/send-friend-request.use-case';
import { AcceptFriendRequestUseCase } from './use-case/accept-friend-request.use-case';
import { DeleteFriendUseCase } from './use-case/delete-friend.use-case';
import { UserModule } from '@/application/user/user.module';
import { UlidModule } from '@/shared/ulid/ulid.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friends]),
    forwardRef(() => UserModule),
    UlidModule,
  ],
  providers: [
    FriendsTypeOrmRepository,
    SendFriendRequestUseCase,
    AcceptFriendRequestUseCase,
    DeleteFriendUseCase,
  ],
  controllers: [FriendController],
  exports: [FriendsTypeOrmRepository],
})
export class FriendModule {}
