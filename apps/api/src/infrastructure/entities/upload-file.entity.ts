import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from './room.entity';

@Entity('upload_file')
export class UploadFile {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 26, unique: true, name: 'public_id' })
  public_id: string;

  @Column({ type: 'varchar', name: 'url' })
  url: string;

  @Column({ type: 'varchar', name: 'type' })
  type: string;

  @Column({ type: 'integer', nullable: true, name: 'room_id' })
  room_id?: number | null;

  @ManyToOne(() => Room, (room) => room.upload_files, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'room_id' })
  room?: Room | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deleted_at?: Date;
}
