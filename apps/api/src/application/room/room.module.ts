import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '@/infrastructure/entities/room.entity';
import { RoomParticipant } from '@/infrastructure/entities/room-participant.entity';
import { RoomsRepository } from '@/infrastructure/repositories/room.repository';
import { RoomParticipantsRepository } from '@/infrastructure/repositories/room-participant.repository';
import { CreateRoomUseCase } from './create-room.use-case';
import { GetRoomUseCase } from './get-room.use-case';
import { DeleteRoomUseCase } from './delete-room.use-case';
import { ListUserRoomsUseCase } from './list-user-rooms.use-case';
import { JoinRoomUseCase } from './join-room.use-case';
import { RoomController } from '@/presentation/controllers/room/room.controller';
import { RoomParticipantsController } from '@/presentation/controllers/room/room-participants.controller';
import { UlidModule } from '@/shared/ulid/ulid.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomParticipant]), UlidModule],
  providers: [
    RoomsRepository,
    RoomParticipantsRepository,
    CreateRoomUseCase,
    GetRoomUseCase,
    DeleteRoomUseCase,
    ListUserRoomsUseCase,
    JoinRoomUseCase,
  ],
  controllers: [RoomController, RoomParticipantsController],
})
export class RoomModule {}
