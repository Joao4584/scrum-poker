import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVoteRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;
}
