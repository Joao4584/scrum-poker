import { IsString, IsOptional, MinLength, IsEnum, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VotingScale } from '@/shared/enums/voting-scale.enum';

export interface CreateRoomDto {
  name: string;
  description?: string;
  public: boolean;
  voting_scale?: VotingScale;
}

export class CreateRoomRequest implements CreateRoomDto {
  @ApiProperty()
  @IsString()
  @MinLength(3, {
    message: 'O nome da sala deve ter pelo menos 3 caracteres.',
  })
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: Boolean })
  @Transform(({ value }) => {
    if (value === 1 || value === '1' || value === true) {
      return true;
    }
    return false;
  })
  @IsIn([0, 1, true, false])
  public: boolean;

  @ApiPropertyOptional({ enum: VotingScale })
  @IsOptional()
  @IsEnum(VotingScale, {
    message: `A escala de votação deve ser uma das seguintes: ${Object.values(
      VotingScale,
    ).join(', ')}.`,
  })
  voting_scale?: VotingScale;
}
