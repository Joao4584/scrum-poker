import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateQuestionRequest {
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsBoolean()
  @IsOptional()
  revealed?: boolean;
}
