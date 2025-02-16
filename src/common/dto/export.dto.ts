import { ColumnDefinitionDto } from './column-definition.dto';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray } from 'class-validator';

export class ExportFileDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ColumnDefinitionDto)
  headers: ColumnDefinitionDto[];
}
