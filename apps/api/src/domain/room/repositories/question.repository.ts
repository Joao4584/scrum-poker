import { Question } from '@/infrastructure/entities/question.entity';

export const QUESTION_REPOSITORY = 'QUESTION_REPOSITORY';

export interface CreateQuestionInput {
  public_id: string;
  room_id: number;
  text: string;
  revealed?: boolean;
  is_active?: boolean;
}

export interface QuestionRepository {
  create(data: CreateQuestionInput): Promise<Question>;
  findByPublicId(public_id: string): Promise<Question | null>;
  update(id: number, data: Partial<Question>): Promise<void>;
  delete(id: number): Promise<void>;
}
