import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { RoomParticipant } from './room-participant.entity';
import { Question } from './question.entity';

@Entity('room')
export class Room {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  @Column({ name: 'public_id', unique: true })
  public_id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ nullable: true, name: 'description' })
  description?: string;

  @Column({ name: 'is_public', default: true })
  is_public: boolean;

  @Column({ name: 'voting_scale', nullable: true })
  voting_scale?: string;

  @Column({ name: 'status', default: 'open' })
  status: string;

  @Column({ nullable: true, name: 'password' })
  password?: string;

  @Column({ name: 'owner_id' })
  owner_id: number;

  @ManyToOne(() => User, (user) => user.createdRooms)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => RoomParticipant, (roomParticipant) => roomParticipant.room)
  participants: RoomParticipant[];

  @OneToMany(() => Question, (question) => question.room)
  questions: Question[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deleted_at?: Date;
}
