import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersRepository } from '@/infrastructure/repositories/user.repository';
import type { User } from '@prisma/client';

@Injectable()
export class CreateJwtUserUseCase {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}

  async execute(data: User) {
    const { id, email, uuid, createdAt, githubId, googleId } = data;

    if (!id || !email) {
      return {
        success: false,
        status: 400,
        message: 'ID and email are required in hash token',
      };
    }

    const token = await jwt.sign(
      { id, email, uuid, createdAt, githubId, googleId },
      process.env.JWT_SECRET || 'default-secret',
      {
        expiresIn: '24h',
      },
    );

    return token;
  }
}
