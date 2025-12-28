import { Injectable } from '@nestjs/common';
import { VoteTypeOrmRepository } from '@/infrastructure/repositories/vote.repository';

@Injectable()
export class DeleteVoteUseCase {
  constructor(
    private readonly voteRepository: VoteTypeOrmRepository,
  ) {}

  async execute(publicId: string): Promise<void> {
    const vote = await this.voteRepository.findByPublicId(publicId);

    if (!vote) {
      throw new Error('Vote not found');
    }

    await this.voteRepository.delete(vote.id);
  }
}
