import { IsString, IsOptional, IsNumber, MinLength } from 'class-validator';

export class CreateRoomRequest {
  @IsString()
  @MinLength(3, {
    message: 'O nome da sala deve ter pelo menos 3 caracteres.',
  })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  
}
