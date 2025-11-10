import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './src/infrastructure/entities/user.entity';
import { Room } from './src/infrastructure/entities/room.entity';
import { RoomParticipant } from './src/infrastructure/entities/room-participant.entity';
import { Question } from './src/infrastructure/entities/question.entity';
import { Vote } from './src/infrastructure/entities/vote.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Room, RoomParticipant, Question, Vote],
  migrations: ['./src/infrastructure/migrations/*.ts'],
  synchronize: false,
});