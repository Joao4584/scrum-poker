import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '@/infrastructure/entities/room.entity';
import { RoomParticipant } from '@/infrastructure/entities/room-participant.entity';
import { RoomFavorite } from '@/infrastructure/entities/room-favorite.entity';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';
import { RoomParticipantTypeOrmRepository } from '@/infrastructure/repositories/room-participant.repository';
import { RoomFavoriteTypeOrmRepository } from '@/infrastructure/repositories/room-favorite.repository';
import { CreateRoomUseCase } from './use-case/create-room.use-case';
import { GetRoomUseCase } from './use-case/get-room.use-case';
import { DeleteRoomUseCase } from './use-case/delete-room.use-case';
import { ListUserRoomsUseCase } from './use-case/list-user-rooms.use-case';
import { JoinRoomUseCase } from './use-case/join-room.use-case';
import { ToggleRoomFavoriteUseCase } from './use-case/toggle-room-favorite.use-case';
import { RoomController } from '@/presentation/controllers/room/room.controller';
import { RoomParticipantsController } from '@/presentation/controllers/room/room-participants.controller';
import { UlidModule } from '@/shared/ulid/ulid.module';
import { Question } from '@/infrastructure/entities/question.entity';
import { QuestionTypeOrmRepository } from '@/infrastructure/repositories/question.repository';
import { CreateQuestionUseCase } from './use-case/create-question.use-case';
import { UpdateQuestionUseCase } from './use-case/update-question.use-case';
import { DeleteQuestionUseCase } from './use-case/delete-question.use-case';
import { QuestionController } from '@/presentation/controllers/room/question.controller';
import { Vote } from '@/infrastructure/entities/vote.entity';
import { VoteTypeOrmRepository } from '@/infrastructure/repositories/vote.repository';
import { CreateVoteUseCase } from './use-case/create-vote.use-case';
import { UpdateVoteUseCase } from './use-case/update-vote.use-case';
import { DeleteVoteUseCase } from './use-case/delete-vote.use-case';
import { VoteController } from '@/presentation/controllers/room/vote.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomParticipant, RoomFavorite, Question, Vote]),
    UlidModule,
  ],
  providers: [
    RoomTypeOrmRepository,
    RoomParticipantTypeOrmRepository,
    RoomFavoriteTypeOrmRepository,
    QuestionTypeOrmRepository,
    VoteTypeOrmRepository,
    CreateRoomUseCase,
    GetRoomUseCase,
    DeleteRoomUseCase,
    ListUserRoomsUseCase,
    JoinRoomUseCase,
    ToggleRoomFavoriteUseCase,
    CreateQuestionUseCase,
    UpdateQuestionUseCase,
    DeleteQuestionUseCase,
    CreateVoteUseCase,
    UpdateVoteUseCase,
    DeleteVoteUseCase,
  ],
  controllers: [
    RoomController,
    RoomParticipantsController,
    QuestionController,
    VoteController,
  ],
})
export class RoomModule {}
