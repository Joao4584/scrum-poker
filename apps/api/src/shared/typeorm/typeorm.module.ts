import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '@/infrastructure/entities/room.entity';
import { RoomParticipant } from '@/infrastructure/entities/room-participant.entity';
import { Question } from '@/infrastructure/entities/question.entity';
import { Vote } from '@/infrastructure/entities/vote.entity';
import { User } from '@/infrastructure/entities/user.entity';
import { Friends } from '@/infrastructure/entities/friends.entity';
import { RoomFavorite } from '@/infrastructure/entities/room-favorite.entity';
import { UploadFile } from '@/infrastructure/entities/upload-file.entity';
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
      extra: {
        options: `-c timezone=${env.DB_TIMEZONE}`,
      },
      entities: [
        User,
        Room,
        RoomParticipant,
        RoomFavorite,
        Question,
        Vote,
        Friends,
        UploadFile,
      ],
      synchronize: false,
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule {}
