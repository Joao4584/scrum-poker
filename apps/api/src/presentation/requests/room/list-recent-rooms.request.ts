import { IsBooleanString, IsIn, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListRecentRoomsQuery {
  @ApiPropertyOptional({ enum: ['recent', 'alphabetical', 'players'] })
  @IsOptional()
  @IsIn(['recent', 'alphabetical', 'players'])
  sort?: 'recent' | 'alphabetical' | 'players';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBooleanString()
  owner_only?: number;
}
