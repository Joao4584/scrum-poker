import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class VerifyRoomPasswordRequest {
  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1, { message: 'A senha da sala e obrigatoria.' })
  password: string;
}
