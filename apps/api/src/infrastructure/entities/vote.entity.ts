import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { User } from './user.entity';

@Entity('vote')
export class Vote {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ unique: true, name: 'uuid' })
  uuid: string;

  @Column({ name: 'question_id' })
  question_id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'value' })
  value: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deleted_at?: Date;

  @ManyToOne(() => Question, (question) => question.votes)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => User, (user) => user.votes)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
