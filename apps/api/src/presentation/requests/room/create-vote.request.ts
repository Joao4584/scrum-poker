import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVoteRequest {
  @IsString()
  @IsNotEmpty()
  value: string;
}
