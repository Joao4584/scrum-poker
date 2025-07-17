import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '@/infrastructure/entities/room.entity';
import { RoomsRepository } from '@/infrastructure/repositories/room.repository';
import { CreateRoomUseCase } from './create-room.use-case';
import { GetRoomUseCase } from './get-room.use-case';
import { DeleteRoomUseCase } from './delete-room.use-case';
import { ListUserRoomsUseCase } from './list-user-rooms.use-case';
import { RoomController } from '@/presentation/controllers/room/room.controller';
import { UlidModule } from '@/shared/ulid/ulid.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), UlidModule],
  providers: [
    RoomsRepository,
    CreateRoomUseCase,
    GetRoomUseCase,
    DeleteRoomUseCase,
    ListUserRoomsUseCase,
  ],
  controllers: [RoomController],
})
export class RoomModule {}
