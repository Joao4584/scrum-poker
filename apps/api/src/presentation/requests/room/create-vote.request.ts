import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoteRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;
}
