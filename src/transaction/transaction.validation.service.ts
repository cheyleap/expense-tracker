import { Inject, Injectable } from '@nestjs/common';
import { BudgetLimitRepository } from '../budget-limit/repository/budget-limit.interface.repository';
import { BudgetLimitRepositoryImpl } from '../budget-limit/repository/budget-limit.repository';
import { TransactionRepository } from './repository/transaciton.interface.repository';
import { TransactionRepositoryImpl } from './repository/transaction.repository';
import { Transaction } from './entities/transaction.entity';
import { ResourceBadRequestException } from '../exception-base/exception/bad-request.exception';

@Injectable()
export class TransactionValidationService {
  constructor(
    @Inject(BudgetLimitRepositoryImpl)
    private readonly budgetLimitRepository: BudgetLimitRepository,
    @Inject(TransactionRepositoryImpl)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async validateUserBudgetLimit(
    userId: number,
    categoryId: number,
    extraAmount: number,
  ): Promise<void> {
    const [transactionList, budgetLimit] = await Promise.all([
      this.transactionRepository.getTransactionUserByCategoryId(
        userId,
        categoryId,
      ),
      this.budgetLimitRepository.getUserBudgetLimitByCategoryId(
        userId,
        categoryId,
      ),
    ]);
    let totalAmount: number =
      this.getTotalAmountFromTransactionList(transactionList);
    totalAmount += extraAmount;
    this.validateBudgetLimit(totalAmount, budgetLimit.limitAmount);
  }

  private getTotalAmountFromTransactionList(
    transactionList: Transaction[],
  ): number {
    let totalAmount: number = 0;
    transactionList.forEach((transaction) => {
      totalAmount += transaction.amount;
    });
    return totalAmount;
  }

  private validateBudgetLimit(totalAmount: number, budgetLimit: number): void {
    if (totalAmount > budgetLimit) {
      throw new ResourceBadRequestException(
        'amount',
        'Amount exceeded the budget limit.',
      );
    }
  }
}
