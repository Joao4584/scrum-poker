import { Inject, Injectable } from '@nestjs/common';
import {
  VOTE_REPOSITORY,
  VoteRepository,
} from '@/domain/room/repositories/vote.repository';
import { UpdateVoteRequest } from '@/presentation/requests/room/update-vote.request';

@Injectable()
export class UpdateVoteUseCase {
  constructor(
    @Inject(VOTE_REPOSITORY) private readonly voteRepository: VoteRepository,
  ) {}

  async execute(publicId: string, data: UpdateVoteRequest): Promise<void> {
    const vote = await this.voteRepository.findByPublicId(publicId);

    if (!vote) {
      throw new Error('Vote not found');
    }

    await this.voteRepository.update(vote.id, data);
  }
}
