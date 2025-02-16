import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { ResourceNotFoundException } from '../exception-base/exception/not-found.exception';
import { CategoryRepositoryImpl } from './repository/category.repository';
import { CategoryRepository } from './repository/category.interface.repository';
import { CategoryQueryDto } from './dto/category-query.dto';
import { PaginationResponse } from '../common/interfaces/response.interface';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CategoryRepositoryImpl)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.create(createCategoryDto);
  }

  findAll(queryDto: CategoryQueryDto): Promise<PaginationResponse<Category>> {
    return this.categoryRepository.findWithPagination(
      queryDto,
      ['name', 'description'],
      {},
    );
  }

  async findOne(id: number): Promise<Category> {
    const category: Category = await this.categoryRepository.findOneById(id);
    if (!category) {
      throw new ResourceNotFoundException('category', id);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category: Category = await this.findOne(id);
    return this.categoryRepository.update(
      Object.assign(category, updateCategoryDto),
    );
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    return this.categoryRepository.softDelete(id);
  }
}
