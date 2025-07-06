import {
  IsEmail,
  IsString,
  MinLength,
  IsIn,
  IsOptional,
} from 'class-validator';

const TypesAuthentication = ['google', 'github'] as const;
export class IntegrationUserRequest {
  @IsString({ message: 'The `type` field must be a string.' })
  @IsIn(TypesAuthentication, {
    message:
      'The `type` field must be one of the following values: google, github.',
  })
  type: (typeof TypesAuthentication)[number];

  @IsEmail({}, { message: 'The `email` field must be a valid email address.' })
  email: string;

  @IsString({ message: 'The `name` field must be a string.' })
  name: string;

  @IsString({ message: 'The `avatarUrl` field must be a string.' })
  avatarUrl: string;

  @IsString({ message: 'The `password` field must be a string.' })
  @MinLength(6, {
    message: 'The `password` field must be at least 6 characters long.',
  })
  password: string;

  @IsOptional()
  @IsString({ message: 'The `typeIntegration` field must be a string.' })
  typeIntegration?: string;

  @IsOptional()
  @IsString({ message: 'The `id` field must be a string.' })
  id?: string;

  @IsOptional()
  @IsString({ message: 'The `github_link` field must be a string.' })
  github_link?: string;

  @IsOptional()
  @IsString({ message: 'The `bio` field must be a string.' })
  bio?: string;
}
