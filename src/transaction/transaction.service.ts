import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from './repository/transaciton.interface.repository';
import { TransactionRepositoryImpl } from './repository/transaction.repository';
import { CategoryService } from '../category/category.service';
import { Transaction } from './entities/transaction.entity';
import { ResourceNotFoundException } from '../exception-base/exception/not-found.exception';
import { TransactionValidationService } from './transaction.validation.service';
import { RequestContext } from '../common/middlewares/request';
import { TransactionType } from './enums/transaction-type.enum';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { PaginationResponse } from '../common/interfaces/response.interface';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TransactionRepositoryImpl)
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryService: CategoryService,
    private readonly transactionValidationService: TransactionValidationService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    await this.categoryService.findOne(createTransactionDto.categoryId);
    const userId: number = RequestContext.currentUser();
    if (createTransactionDto.transactionType === TransactionType.Expense) {
      await this.transactionValidationService.validateUserBudgetLimit(
        userId,
        createTransactionDto.categoryId,
        createTransactionDto.amount,
      );
    }
    return this.transactionRepository.create({
      ...createTransactionDto,
      category: {
        id: createTransactionDto.categoryId,
      },
      user: { id: userId },
    });
  }

  findAll(
    queryDto: TransactionQueryDto,
  ): Promise<PaginationResponse<Transaction>> {
    return this.transactionRepository.findWithPagination(
      queryDto,
      ['type', 'description'],
      {
        where: {
          category: { id: queryDto.categoryId },
          user: { id: queryDto.userId },
        },
        relation: { user: true, category: true },
        select: { user: { id: true }, category: { id: true } },
      },
    );
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction: Transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
    });
    if (!transaction) {
      throw new ResourceNotFoundException('transaction', id);
    }

    return transaction;
  }

  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const [transaction] = await Promise.all([
      this.findOne(id),
      updateTransactionDto.categoryId &&
        this.categoryService.findOne(updateTransactionDto.categoryId),
    ]);
    return this.transactionRepository.update(
      Object.assign(transaction, {
        ...updateTransactionDto,
        category: { id: updateTransactionDto.categoryId },
      }),
    );
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    this.transactionRepository.softDelete(id);
  }
}
