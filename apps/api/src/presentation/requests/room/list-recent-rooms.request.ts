import { IsBooleanString, IsIn, IsOptional } from 'class-validator';

export class ListRecentRoomsQuery {
  @IsOptional()
  @IsIn(['recent', 'alphabetical', 'players'])
  sort?: 'recent' | 'alphabetical' | 'players';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @IsBooleanString()
  owner_only?: number;
}
