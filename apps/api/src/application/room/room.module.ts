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
import { Question } from '@/infrastructure/entities/question.entity';
import { QuestionRepository } from '@/infrastructure/repositories/question.repository';
import { CreateQuestionUseCase } from './create-question.use-case';
import { UpdateQuestionUseCase } from './update-question.use-case';
import { DeleteQuestionUseCase } from './delete-question.use-case';
import { QuestionController } from '@/presentation/controllers/room/question.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomParticipant, Question]),
    UlidModule,
  ],
  providers: [
    RoomsRepository,
    RoomParticipantsRepository,
    QuestionRepository,
    CreateRoomUseCase,
    GetRoomUseCase,
    DeleteRoomUseCase,
    ListUserRoomsUseCase,
    JoinRoomUseCase,
    CreateQuestionUseCase,
    UpdateQuestionUseCase,
    DeleteQuestionUseCase,
  ],
  controllers: [RoomController, RoomParticipantsController, QuestionController],
})
export class RoomModule {}
