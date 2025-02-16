import { IsDecimal, IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBudgetLimitDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  limitAmount: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  categoryId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  userId: number;
}
