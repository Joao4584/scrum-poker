import {
  IsEmail,
  IsString,
  MinLength,
  IsIn,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const TypesAuthentication = ['google', 'github'] as const;
export class IntegrationUserRequest {
  @ApiProperty({ enum: TypesAuthentication })
  @IsString({ message: 'The `type` field must be a string.' })
  @IsIn(TypesAuthentication, {
    message:
      'The `type` field must be one of the following values: google, github.',
  })
  type: (typeof TypesAuthentication)[number];

  @ApiProperty()
  @IsEmail({}, { message: 'The `email` field must be a valid email address.' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'The `name` field must be a string.' })
  name: string;

  @ApiProperty()
  @IsString({ message: 'The `avatar_url` field must be a string.' })
  avatar_url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'The `password` field must be a string.' })
  @MinLength(6, {
    message: 'The `password` field must be at least 6 characters long.',
  })
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'The `typeIntegration` field must be a string.' })
  typeIntegration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'The `id` field must be a string.' })
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'The `github_link` field must be a string.' })
  github_link?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'The `bio` field must be a string.' })
  bio?: string;
}
