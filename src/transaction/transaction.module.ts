import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepositoryImpl } from './repository/transaction.repository';
import { Transaction } from './entities/transaction.entity';
import { CategoryModule } from '../category/category.module';
import { BudgetLimitModule } from '../budget-limit/budget-limit.module';
import { TransactionValidationService } from './transaction.validation.service';

@Module({
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionRepositoryImpl,
    TransactionValidationService,
  ],
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    CategoryModule,
    BudgetLimitModule,
  ],
})
export class TransactionModule {}
