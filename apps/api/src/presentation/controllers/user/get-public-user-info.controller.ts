import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetPublicUserInfoUseCase } from '@/application/user/use-case/get-public-user-info.use-case';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class GetPublicUserInfoController {
  constructor(private readonly getPublicUserInfoUseCase: GetPublicUserInfoUseCase) {}

  @Get(':public_id/info')
  @ApiOperation({ summary: 'Get lightweight public user info by public_id' })
  @ApiResponse({
    status: 200,
    description: 'Lightweight user profile',
    schema: {
      example: {
        data: {
          public_id: '01JWC2X9GGT4M8P2GKAQA44B9W',
          name: 'Joao',
          avatar_url: 'https://example.com/avatar.png',
          description: 'Frontend engineer and gamer',
          xp: 180,
          level: 4,
          member_since: '2025-12-10T12:32:12.123Z',
          platform_time_days: 71,
        },
      },
    },
  })
  async getInfo(@Param('public_id') publicId: string) {
    const data = await this.getPublicUserInfoUseCase.execute(publicId);
    return { data };
  }
}
