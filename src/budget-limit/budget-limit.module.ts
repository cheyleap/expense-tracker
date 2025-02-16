import { Module } from '@nestjs/common';
import { BudgetLimitService } from './budget-limit.service';
import { BudgetLimitController } from './budget-limit.controller';
import { BudgetLimitRepositoryImpl } from './repository/budget-limit.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetLimit } from './entities/budget-limit.entity';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [BudgetLimitController],
  providers: [BudgetLimitService, BudgetLimitRepositoryImpl],
  imports: [
    TypeOrmModule.forFeature([BudgetLimit]),
    CategoryModule,
    UserModule,
  ],
  exports: [BudgetLimitRepositoryImpl],
})
export class BudgetLimitModule {}
