import { Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { IntegrationUserRequest } from '../requests/integration-user.request';

export class UsersRepository {
  constructor(@Inject('PrismaConnect') private readonly prisma: PrismaClient) {}

  async insertUser(data: IntegrationUserRequest) {
    let dataValue: any = {
      email: data.email,
      name: data.name,
      avatarUrl: data.avatarUrl,
    };

    if (data.type == 'github' && data.githubId) {
      dataValue = {
        ...dataValue,
        githubId: data.githubId,
        githubLink: data.githubLink,
        bio: data.githubBio,
      };
    }
    if (data.type == 'google') {
      dataValue = {
        ...dataValue,
        googleId: data.googleId,
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
          githubId: data.githubId,
        },
      });
    }

    if (data.type == 'google') {
    }

    return user;
  }
}
