import { Injectable } from '@nestjs/common';
import { VoteRepository } from '@/infrastructure/repositories/vote.repository';
import { UpdateVoteRequest } from '@/presentation/requests/room/update-vote.request';

@Injectable()
export class UpdateVoteUseCase {
  constructor(private readonly voteRepository: VoteRepository) {}

  async execute(publicId: string, data: UpdateVoteRequest): Promise<void> {
    const vote = await this.voteRepository.findOne({
      where: { public_id: publicId },
    });

    if (!vote) {
      throw new Error('Vote not found');
    }

    await this.voteRepository.update(vote.id, data);
  }
}
