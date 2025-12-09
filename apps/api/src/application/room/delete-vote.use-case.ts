import { Inject, Injectable } from '@nestjs/common';
import {
  VOTE_REPOSITORY,
  VoteRepository,
} from '@/domain/room/repositories/vote.repository';

@Injectable()
export class DeleteVoteUseCase {
  constructor(
    @Inject(VOTE_REPOSITORY) private readonly voteRepository: VoteRepository,
  ) {}

  async execute(publicId: string): Promise<void> {
    const vote = await this.voteRepository.findByPublicId(publicId);

    if (!vote) {
      throw new Error('Vote not found');
    }

    await this.voteRepository.delete(vote.id);
  }
}
