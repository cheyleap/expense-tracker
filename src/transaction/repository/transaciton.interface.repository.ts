import { BaseRepository } from '../../common/entity/base-repository';
import { Transaction } from '../entities/transaction.entity';

export interface TransactionRepository extends BaseRepository<Transaction> {
  getTransactionUserByCategoryId(
    userId: number,
    categoryId: number,
  ): Promise<Transaction[]>;
}
