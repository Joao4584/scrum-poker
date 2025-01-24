import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'The `email` field must be a valid email.' })
  email: string;

  @IsString()
  @MinLength(3, {
    message: 'The `name` field must be at least 3 characters long.',
  })
  name: string;

  @IsString()
  @MinLength(6, { message: 'The password must be at least 6 characters long.' })
  password: string;

  @IsString()
  @MinLength(3, {
    message: 'The `user` field must be at least 3 characters long.',
  })
  user: string;
}
