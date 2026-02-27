import { Injectable } from '@nestjs/common';
import { SupportRequestTypeOrmRepository } from '@/infrastructure/repositories/support-request.repository';

@Injectable()
export class ListSupportRequestsUseCase {
  constructor(private readonly supportRequestRepository: SupportRequestTypeOrmRepository) {}

  async execute(user_id: number) {
    const requests = await this.supportRequestRepository.findByUserId(user_id);

    return requests.map((request) => ({
      public_id: request.public_id,
      subject: request.subject,
      message: request.message,
      rating: request.rating,
      created_at: request.created_at,
    }));
  }
}
