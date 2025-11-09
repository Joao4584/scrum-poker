import { IsString, IsOptional, MinLength, IsEnum, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { VotingScale } from '@/shared/enums/voting-scale.enum';

export interface CreateRoomDto {
  name: string;
  description?: string;
  public: boolean;
  voting_scale?: VotingScale;
}

export class CreateRoomRequest implements CreateRoomDto {
  @IsString()
  @MinLength(3, {
    message: 'O nome da sala deve ter pelo menos 3 caracteres.',
  })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Transform(({ value }) => {
    if (value === 1 || value === '1' || value === true) {
      return true;
    }
    return false;
  })
  @IsIn([0, 1, true, false])
  public: boolean;

  @IsOptional()
  @IsEnum(VotingScale, {
    message: `A escala de votação deve ser uma das seguintes: ${Object.values(
      VotingScale,
    ).join(', ')}.`,
  })
  voting_scale?: VotingScale;
}
