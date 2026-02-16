import { Injectable } from '@nestjs/common';
import { UserTypeOrmRepository } from '@/infrastructure/repositories/user.repository';
import { AppErrors } from '@/presentation/errors';

@Injectable()
export class AddUserXpUseCase {
  constructor(private readonly usersRepository: UserTypeOrmRepository) {}

  async execute(userId: number, amount: number) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw AppErrors.notFound('Usuario nao encontrado');
    }

    const xp = (user.xp ?? 0) + amount;
    return await this.usersRepository.update(user.id, { xp });
  }
}
