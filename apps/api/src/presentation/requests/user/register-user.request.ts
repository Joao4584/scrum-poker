import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserRequest {
  @ApiProperty()
  @IsEmail({}, { message: 'The `email` field must be a valid email.' })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(3, {
    message: 'The `name` field must be at least 3 characters long.',
  })
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(6, { message: 'The password must be at least 6 characters long.' })
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(3, {
    message: 'The `user` field must be at least 3 characters long.',
  })
  user: string;
}
