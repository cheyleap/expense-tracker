import { PartialType } from '@nestjs/mapped-types';
import { CreateBudgetLimitDto } from './create-budget-limit.dto';

export class UpdateBudgetLimitDto extends PartialType(CreateBudgetLimitDto) {}
