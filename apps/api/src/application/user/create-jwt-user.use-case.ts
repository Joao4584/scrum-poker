import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersRepository } from '@/infrastructure/repositories/user.repository';
import { User } from '@/infrastructure/entities/user.entity';

interface JwtPayload {
  id: number;
  email: string;
  uuid: string;
  created_at: Date;
  github_id?: string;
  google_id?: string;
}

@Injectable()
export class CreateJwtUserUseCase {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}

  async execute(data: User) {
    const { id, email, uuid, created_at, github_id, google_id } = data;

    if (!id || !email) {
      return {
        success: false,
        status: 400,
        message: 'ID and email are required in hash token',
      };
    }

    const payload: JwtPayload = { id, email, uuid, created_at, github_id, google_id };

    const token = await jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default-secret',
      {
        expiresIn: '24h',
      },
    );

    return token;
  }
}