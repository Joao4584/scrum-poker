import { Inject, Injectable } from '@nestjs/common';
import type { RegisterUserRequest } from '../requests/register-user.request';
import { PrismaClient } from '@prisma/client';
import type { IntegrationUserRequest } from '../requests/integration-user.request';

@Injectable()
export class LoadUserByIdUseCase {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  async execute(data: IntegrationUserRequest) {
    return null;
    // return this.prisma.user.findFirst();
  }
}
