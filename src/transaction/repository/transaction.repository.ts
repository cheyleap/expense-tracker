import { TransactionRepository } from './transaciton.interface.repository';
import { BaseRepositoryService } from '../../common/entity/base-repository-impl';
import { Transaction } from '../entities/transaction.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionRepositoryImpl
  extends BaseRepositoryService<Transaction>
  implements TransactionRepository
{
  constructor(
    @InjectRepository(Transaction)
    repository: Repository<Transaction>,
  ) {
    super(repository);
  }

  getTransactionUserByCategoryId(
    userId: number,
    categoryId: number,
  ): Promise<Transaction[]> {
    return this.find({
      where: {
        user: { id: userId },
        category: { id: categoryId },
      },
      relations: ['user', 'category'],
    });
  }
}
