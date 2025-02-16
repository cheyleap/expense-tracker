import { BaseRepositoryService } from '../../common/entity/base-repository-impl';
import { BudgetLimit } from '../entities/budget-limit.entity';
import { BudgetLimitRepository } from './budget-limit.interface.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BudgetLimitRepositoryImpl
  extends BaseRepositoryService<BudgetLimit>
  implements BudgetLimitRepository
{
  constructor(
    @InjectRepository(BudgetLimit) repository: Repository<BudgetLimit>,
  ) {
    super(repository);
  }

  getUserBudgetLimitByCategoryId(
    userId: number,
    categoryId: number,
  ): Promise<BudgetLimit> {
    return this.findOne({
      where: {
        user: { id: userId },
        category: { id: categoryId },
      },
      relations: ['user', 'category'],
      select: {
        user: { id: true },
        category: { id: true },
      },
    });
  }
}
