import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '@/infrastructure/entities/room.entity';
import { RoomParticipant } from '@/infrastructure/entities/room-participant.entity';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';
import { RoomParticipantTypeOrmRepository } from '@/infrastructure/repositories/room-participant.repository';
import { CreateRoomUseCase } from './create-room.use-case';
import { GetRoomUseCase } from './get-room.use-case';
import { DeleteRoomUseCase } from './delete-room.use-case';
import { ListUserRoomsUseCase } from './list-user-rooms.use-case';
import { JoinRoomUseCase } from './join-room.use-case';
import { RoomController } from '@/presentation/controllers/room/room.controller';
import { RoomParticipantsController } from '@/presentation/controllers/room/room-participants.controller';
import { UlidModule } from '@/shared/ulid/ulid.module';
import { Question } from '@/infrastructure/entities/question.entity';
import { QuestionTypeOrmRepository } from '@/infrastructure/repositories/question.repository';
import { CreateQuestionUseCase } from './create-question.use-case';
import { UpdateQuestionUseCase } from './update-question.use-case';
import { DeleteQuestionUseCase } from './delete-question.use-case';
import { QuestionController } from '@/presentation/controllers/room/question.controller';
import { Vote } from '@/infrastructure/entities/vote.entity';
import { VoteTypeOrmRepository } from '@/infrastructure/repositories/vote.repository';
import { CreateVoteUseCase } from './create-vote.use-case';
import { UpdateVoteUseCase } from './update-vote.use-case';
import { DeleteVoteUseCase } from './delete-vote.use-case';
import { VoteController } from '@/presentation/controllers/room/vote.controller';
import { ROOM_REPOSITORY } from '@/domain/room/repositories/room.repository';
import { ROOM_PARTICIPANT_REPOSITORY } from '@/domain/room/repositories/room-participant.repository';
import { QUESTION_REPOSITORY } from '@/domain/room/repositories/question.repository';
import { VOTE_REPOSITORY } from '@/domain/room/repositories/vote.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomParticipant, Question, Vote]),
    UlidModule,
  ],
  providers: [
    {
      provide: ROOM_REPOSITORY,
      useClass: RoomTypeOrmRepository,
    },
    {
      provide: ROOM_PARTICIPANT_REPOSITORY,
      useClass: RoomParticipantTypeOrmRepository,
    },
    {
      provide: QUESTION_REPOSITORY,
      useClass: QuestionTypeOrmRepository,
    },
    {
      provide: VOTE_REPOSITORY,
      useClass: VoteTypeOrmRepository,
    },
    CreateRoomUseCase,
    GetRoomUseCase,
    DeleteRoomUseCase,
    ListUserRoomsUseCase,
    JoinRoomUseCase,
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
