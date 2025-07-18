import { Injectable } from '@nestjs/common';
import { VoteRepository } from '@/infrastructure/repositories/vote.repository';

@Injectable()
export class DeleteVoteUseCase {
  constructor(private readonly voteRepository: VoteRepository) {}

  async execute(publicId: string): Promise<void> {
    const vote = await this.voteRepository.findOne({
      where: { public_id: publicId },
    });

    if (!vote) {
      throw new Error('Vote not found');
    }

    await this.voteRepository.delete(vote.id);
  }
}
