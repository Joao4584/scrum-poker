import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Room } from './room.entity';

@Entity('room_favorite')
@Unique('UQ_room_favorite_user_room', ['user_id', 'room_id'])
export class RoomFavorite {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 26, unique: true, name: 'public_id' })
  public_id: string;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'room_id' })
  room_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.roomFavorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Room, (room) => room.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
