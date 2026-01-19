import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateQuestionRequest {
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  revealed?: boolean;
}
