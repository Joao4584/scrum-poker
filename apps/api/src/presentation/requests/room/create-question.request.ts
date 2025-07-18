import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionRequest {
  @IsString()
  @IsNotEmpty()
  title: string;
}
