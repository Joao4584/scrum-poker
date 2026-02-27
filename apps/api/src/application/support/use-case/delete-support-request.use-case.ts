import { Injectable } from '@nestjs/common';
import { SupportRequestTypeOrmRepository } from '@/infrastructure/repositories/support-request.repository';
import { AppErrors } from '@/presentation/errors';

@Injectable()
export class DeleteSupportRequestUseCase {
  constructor(private readonly supportRequestRepository: SupportRequestTypeOrmRepository) {}

  async execute(user_id: number, public_id: string) {
    const request = await this.supportRequestRepository.findByPublicId(public_id);
    if (!request) {
      throw AppErrors.notFound('Feedback nao encontrado');
    }

    if (request.user_id !== user_id) {
      throw AppErrors.forbidden('Voce nao pode remover este feedback');
    }

    await this.supportRequestRepository.softDeleteById(request.id);
  }
}
