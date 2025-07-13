import { DataSource } from 'typeorm';
import { User } from './src/infrastructure/entities/user.entity';
import { Room } from './src/infrastructure/entities/room.entity';
import { RoomParticipant } from './src/infrastructure/entities/room-participant.entity';
import { Question } from './src/infrastructure/entities/question.entity';
import { Vote } from './src/infrastructure/entities/vote.entity';
import { env } from '@scrum-poker/env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  entities: [User, Room, RoomParticipant, Question, Vote],
  migrations: ['src/infrastructure/migrations/*.ts'],
  synchronize: false,
});
