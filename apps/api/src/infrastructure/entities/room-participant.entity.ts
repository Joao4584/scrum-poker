import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity('room_participant')
export class RoomParticipant {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ unique: true, name: 'uuid' })
  uuid: string;

  @Column({ name: 'room_id' })
  room_id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'is_admin', default: false })
  is_admin: boolean;

  @Column({ type: 'timestamp', name: 'joined_at' })
  joined_at: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deleted_at?: Date;

  @ManyToOne(() => Room, (room) => room.participants)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => User, (user) => user.roomParticipation)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
