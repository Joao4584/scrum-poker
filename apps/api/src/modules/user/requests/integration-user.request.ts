import { IsEmail, IsString, MinLength, IsIn } from 'class-validator';

const TypesAuthentication = ['google', 'github'] as const;
export class IntegrationUserRequest {
  @IsString({ message: 'The `type` field must be a string.' })
  @IsIn(TypesAuthentication, {
    message:
      'The `type` field must be one of the following values: google, github.',
  })
  type: (typeof TypesAuthentication)[number];
}
