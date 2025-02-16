import { BasePaginationQueryDto } from '../../common/dto/base-pagination-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class TransactionQueryDto extends BasePaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  userId: number;

  @ApiPropertyOptional()
  @IsOptional()
  categoryId: number;
}
