import { Injectable } from '@nestjs/common';
import { UlidService } from '@/shared/ulid/ulid.service';
import { SupportRequestTypeOrmRepository } from '@/infrastructure/repositories/support-request.repository';

interface CreateSupportRequestInput {
  user_id: number;
  subject: string;
  message: string;
  rating: number;
}

@Injectable()
export class CreateSupportRequestUseCase {
  constructor(
    private readonly supportRequestRepository: SupportRequestTypeOrmRepository,
    private readonly ulidService: UlidService,
  ) {}

  async execute(input: CreateSupportRequestInput) {
    const supportRequest = await this.supportRequestRepository.create({
      public_id: this.ulidService.generateId(),
      user_id: input.user_id,
      subject: input.subject.trim(),
      message: input.message.trim(),
      rating: input.rating,
    });

    return {
      public_id: supportRequest.public_id,
      subject: supportRequest.subject,
      message: supportRequest.message,
      rating: supportRequest.rating,
      created_at: supportRequest.created_at,
    };
  }
}
