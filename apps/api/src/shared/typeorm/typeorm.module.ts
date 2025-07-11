import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lobby } from '@/infrastructure/entities/lobby.entity';
import { LobbyParticipant } from '@/infrastructure/entities/lobby-participant.entity';
import { Room } from '@/infrastructure/entities/room.entity';
import { RoomParticipant } from '@/infrastructure/entities/room-participant.entity';
import { Question } from '@/infrastructure/entities/question.entity';
import { Vote } from '@/infrastructure/entities/vote.entity';
import { User } from '@/infrastructure/entities/user.entity';
import { env } from '@scrum-poker/env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      entities: [User, Lobby, LobbyParticipant, Room, RoomParticipant, Question, Vote],
      synchronize: false,
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule {}
