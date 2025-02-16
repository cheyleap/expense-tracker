import { Inject, Injectable } from '@nestjs/common';
import { CreateBudgetLimitDto } from './dto/create-budget-limit.dto';
import { UpdateBudgetLimitDto } from './dto/update-budget-limit.dto';
import { BudgetLimitRepositoryImpl } from './repository/budget-limit.repository';
import { BudgetLimitRepository } from './repository/budget-limit.interface.repository';
import { CategoryService } from '../category/category.service';
import { UserService } from '../user/user.service';
import { BudgetLimit } from './entities/budget-limit.entity';
import { ResourceNotFoundException } from '../exception-base/exception/not-found.exception';
import { PaginationResponse } from '../common/interfaces/response.interface';
import { BudgetLimitQueryDto } from './dto/budget-limit-query.dto';

@Injectable()
export class BudgetLimitService {
  constructor(
    @Inject(BudgetLimitRepositoryImpl)
    private readonly budgetLimitRepository: BudgetLimitRepository,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  async create(
    createBudgetLimitDto: CreateBudgetLimitDto,
  ): Promise<BudgetLimit> {
    await Promise.all([
      this.categoryService.findOne(createBudgetLimitDto.categoryId),
      this.userService.findOne(createBudgetLimitDto.userId),
    ]);
    return this.budgetLimitRepository.create({
      ...createBudgetLimitDto,
      user: { id: createBudgetLimitDto.userId },
      category: { id: createBudgetLimitDto.categoryId },
    });
  }

  findAll(
    queryDto: BudgetLimitQueryDto,
  ): Promise<PaginationResponse<BudgetLimit>> {
    return this.budgetLimitRepository.findWithPagination(queryDto, [], {
      where: {
        user: { id: queryDto.userId },
        category: { id: queryDto.categoryId },
      },
      relation: { user: true, category: true },
      select: { user: { id: true }, category: { id: true } },
    });
  }

  async findOne(id: number): Promise<BudgetLimit> {
    const budgetLimit: BudgetLimit = await this.budgetLimitRepository.findOne({
      where: { id },
      relations: { user: true, category: true },
    });

    if (!budgetLimit) {
      throw new ResourceNotFoundException('budget limit', id);
    }

    return budgetLimit;
  }

  async update(id: number, updateBudgetLimitDto: UpdateBudgetLimitDto) {
    const [budgetLimit] = await Promise.all([
      this.findOne(id),
      updateBudgetLimitDto.userId &&
        this.userService.findOne(updateBudgetLimitDto.userId),
      updateBudgetLimitDto.categoryId &&
        this.categoryService.findOne(updateBudgetLimitDto.categoryId),
    ]);
    return this.budgetLimitRepository.update(
      Object.assign(budgetLimit, {
        ...updateBudgetLimitDto,
        user: { id: updateBudgetLimitDto.userId },
        category: { id: updateBudgetLimitDto.categoryId },
      }),
    );
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    this.budgetLimitRepository.softDelete(id);
  }
}
