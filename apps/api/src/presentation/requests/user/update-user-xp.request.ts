import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateUserXpRequest {
  @ApiProperty({ minimum: 1, example: 50 })
  @IsInt()
  @Min(1)
  amount: number;
}
