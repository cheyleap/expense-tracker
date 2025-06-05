import { Args, Query, Resolver } from '@nestjs/graphql';
import { BudgetLimit } from '../entities/budget-limit.entity';
import { BudgetLimitRepositoryImpl } from '../repository/budget-limit.repository';

@Resolver(() => BudgetLimit)
export class BudgetLimitResolver {
  constructor(
    private readonly budgetLimitRepository: BudgetLimitRepositoryImpl,
  ) {}

  @Query(() => [BudgetLimit])
  getBudgetLimits() {
    return this.budgetLimitRepository.find();
  }

  @Query(() => BudgetLimit)
  getBudgetLimitById(@Args('id') id: number) {
    return this.budgetLimitRepository.findOne({ where: { id } });
  }
}
