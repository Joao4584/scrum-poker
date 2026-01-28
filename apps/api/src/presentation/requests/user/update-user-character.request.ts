import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserCharacterRequest {
  @ApiProperty({ maxLength: 15 })
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  character_key: string;
}
