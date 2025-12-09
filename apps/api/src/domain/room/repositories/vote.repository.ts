import { Vote } from '@/infrastructure/entities/vote.entity';

export const VOTE_REPOSITORY = 'VOTE_REPOSITORY';

export interface CreateVoteInput {
  public_id: string;
  question_id: number;
  user_id: number;
  value: string;
}

export interface VoteRepository {
  create(data: CreateVoteInput): Promise<Vote>;
  findByPublicId(public_id: string): Promise<Vote | null>;
  update(id: number, data: Partial<Vote>): Promise<void>;
  delete(id: number): Promise<void>;
}
