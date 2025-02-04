import { Inject, Injectable } from '@nestjs/common';
import type { RegisterUserRequest } from '../requests/register-user.request';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  async execute(data: RegisterUserRequest) {
    return null;
    // return this.prisma.user.findFirst();
  }
}
