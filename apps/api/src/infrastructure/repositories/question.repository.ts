import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '@/infrastructure/entities/question.entity';
export interface CreateQuestionInput {
  public_id: string;
  room_id: number;
  text: string;
  revealed?: boolean;
  is_active?: boolean;
}

@Injectable()
export class QuestionTypeOrmRepository {
  constructor(
    @InjectRepository(Question)
    private readonly repository: Repository<Question>,
  ) {}

  async create(data: CreateQuestionInput): Promise<Question> {
    const entity = this.repository.create({
      ...data,
      revealed: data.revealed ?? false,
      is_active: data.is_active ?? false,
    });
    const saved = await this.repository.save(entity);
    return saved;
  }

  async findByPublicId(public_id: string): Promise<Question | null> {
    const question = await this.repository.findOne({
      where: {
        public_id,
        deleted_at: null,
      },
    });
    return question;
  }

  async findByRoomId(room_id: number): Promise<Question[]> {
    return await this.repository.find({
      where: {
        room_id,
        deleted_at: null,
      },
      relations: {
        votes: {
          user: true,
        },
      },
      order: {
        is_active: 'DESC',
        created_at: 'DESC',
      },
    });
  }

  async findActiveByRoomId(room_id: number): Promise<Question | null> {
    return await this.repository.findOne({
      where: {
        room_id,
        is_active: true,
        deleted_at: null,
      },
    });
  }

  async update(id: number, data: Partial<Question>): Promise<void> {
    await this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.update(id, {
      is_active: false,
      deleted_at: new Date(),
    });
  }
}
