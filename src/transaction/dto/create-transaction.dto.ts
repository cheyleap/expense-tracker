import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';
import { TransactionType } from '../enums/transaction-type.enum';
import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  categoryId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiProperty()
  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @Optional()
  @ApiPropertyOptional()
  description: string;
}
