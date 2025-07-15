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
import { Room } from './room.entity';
import { Vote } from './vote.entity';

@Entity('question')
export class Question {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 26, unique: true, name: 'public_id' })
  public_id: string;

  @Column({ name: 'room_id' })
  room_id: number;

  @Column({ name: 'text' })
  text: string;

  @Column({ name: 'revealed', default: false })
  revealed: boolean;

  @Column({ name: 'is_active', default: false })
  is_active: boolean;

  @OneToMany(() => Vote, (vote) => vote.question)
  votes: Vote[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deleted_at?: Date;

  @ManyToOne(() => Room, (room) => room.questions)
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
