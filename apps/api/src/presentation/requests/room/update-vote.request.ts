import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateVoteRequest {
  @IsString()
  @IsNotEmpty()
  value: string;
}
