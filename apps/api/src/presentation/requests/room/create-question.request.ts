import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
}
