import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { ExportDataTypeEnum } from '../enums/export-data-type.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BasePaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  offset?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiPropertyOptional()
  @IsOptional()
  orderBy: string;

  @ApiPropertyOptional({ enum: ExportDataTypeEnum })
  @IsOptional()
  @IsEnum(ExportDataTypeEnum)
  exportFileType?: ExportDataTypeEnum;
}
