import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Room } from './room.entity';
import { Vote } from './vote.entity';
import { RoomParticipant } from './room-participant.entity';

export enum Language {
  en_us = 'en_us',
  pt_br = 'pt_br',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ unique: true, name: 'uuid' })
  uuid: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ unique: true, name: 'email' })
  email: string;

  @Column({ nullable: true, name: 'password' })
  password?: string;

  @Column({ name: 'github_id', nullable: true, unique: true })
  github_id?: string;

  @Column({ name: 'google_id', nullable: true, unique: true })
  google_id?: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatar_url?: string;

  @Column({ name: 'status', default: 'available' })
  status: string;

  @Column({ name: 'github_link', nullable: true })
  github_link?: string;

  @Column({ nullable: true, name: 'bio' })
  bio?: string;

  @Column({
    type: 'enum',
    enum: Language,
    default: Language.pt_br,
    name: 'language',
  })
  language: Language;

  @Column({ name: 'last_online', type: 'timestamp', nullable: true })
  last_online?: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deleted_at?: Date;

  @OneToMany(() => Room, (room) => room.owner)
  createdRooms: Room[];

  @OneToMany(() => RoomParticipant, (roomParticipant) => roomParticipant.user)
  roomParticipation: RoomParticipant[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];
}
