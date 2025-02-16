import { BasePaginationQueryDto } from '../../common/dto/base-pagination-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TransactionType } from '../enums/transaction-type.enum';

export class TransactionQueryDto extends BasePaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  userId: number;

  @ApiPropertyOptional()
  @IsOptional()
  categoryId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TransactionType)
  transactionType: TransactionType;
}
