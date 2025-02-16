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
import { Raw } from 'typeorm';
import { DEFAULT_DATE_FORMAT } from '../common/constants/date.constant';
import { dayJs } from '../common/utils/date.util';
import { ExportFileDto } from '../common/dto/export.dto';
import { exportDataFiles } from '../common/export-file/export-file';

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

  async export(queryDto: TransactionQueryDto, exportDto: ExportFileDto) {
    const { data } = await this.findAll(queryDto);
    return exportDataFiles(
      queryDto.exportFileType,
      'TRANSACTION',
      exportDto,
      data,
    );
  }

  findAll(
    queryDto: TransactionQueryDto,
  ): Promise<PaginationResponse<Transaction>> {
    return this.transactionRepository.findWithPagination(
      queryDto,
      ['transactionType', 'description'],
      {
        where: {
          category: { id: queryDto.categoryId },
          user: { id: queryDto.userId },
          transactionType: queryDto.transactionType,
          date: Raw(
            (date: string) =>
              `TO_CHAR(${date}, '${DEFAULT_DATE_FORMAT}') >= '${dayJs(queryDto.fromDate).format(DEFAULT_DATE_FORMAT)}' 
              AND TO_CHAR(${date}, '${DEFAULT_DATE_FORMAT}') <= '${dayJs(queryDto.toDate).add(1, 'day').format(DEFAULT_DATE_FORMAT)}'`,
          ),
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
