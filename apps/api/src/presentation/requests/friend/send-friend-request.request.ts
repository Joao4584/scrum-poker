import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendFriendRequest {
  @ApiProperty()
  @IsString()
  friend_public_id: string;
}
