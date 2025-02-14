import { Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { IntegrationUserRequest } from '../requests/integration-user.request';

export class UsersRepository {
  constructor(@Inject('PrismaConnect') private readonly prisma: PrismaClient) {}

  async insertUser(data: IntegrationUserRequest) {
    console.log('🚀 ~ UsersRepository ~ insertUser ~ data:', data);
    let dataValue: any = {
      email: data.email,
      name: data.name,
      avatarUrl: data.avatarUrl,
    };

    if (data.type == 'github' && data.id) {
      dataValue = {
        ...dataValue,
        githubId: String(data.id),
        githubLink: data.github_link,
        bio: data.bio,
      };
    }
    if (data.type == 'google') {
      dataValue = {
        ...dataValue,
        googleId: data.id,
      };
    }

    return await this.prisma.user.create({
      data: dataValue,
    });
  }

  async loadUserIntegration(data: IntegrationUserRequest) {
    let user: any = false;
    if (data.type == 'github') {
      user = this.prisma.user.findFirst({
        where: {
          githubId: String(data.id),
        },
      });
    }

    return user;
  }
}
