import { BudgetLimit } from '../entities/budget-limit.entity';
import { BaseRepository } from '../../common/entity/base-repository';

export interface BudgetLimitRepository extends BaseRepository<BudgetLimit> {
  getUserBudgetLimitByCategoryId(
    userId: number,
    categoryId: number,
  ): Promise<BudgetLimit>;
}
