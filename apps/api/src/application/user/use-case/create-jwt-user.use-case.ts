import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserTypeOrmRepository } from '@/infrastructure/repositories/user.repository';
import { User } from '@/infrastructure/entities/user.entity';

interface JwtPayload {
  public_id: string;
  email: string;
  created_at: Date;
  github_id?: string;
  google_id?: string;
  iat: number;
}

@Injectable()
export class CreateJwtUserUseCase {
  constructor(
    private readonly usersRepository: UserTypeOrmRepository,
  ) {}

  async execute(data: User) {
    const { id, email, public_id, created_at, github_id, google_id } = data;

    if (!id || !email) {
      return {
        success: false,
        status: 400,
        message: 'ID and email are required in hash token',
      };
    }

    const payload: JwtPayload = {
      email,
      public_id: public_id.toString(),
      created_at,
      github_id,
      google_id,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = await jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default-secret',
      {
        expiresIn: '24h',
      },
    );

    const decoded = jwt.decode(token) as JwtPayload;
    await this.usersRepository.update(id, {
      last_login_iat: BigInt(decoded.iat),
    });

    return token;
  }
}
