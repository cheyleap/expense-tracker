import { Category } from '../entities/category.entity';
import { BaseRepositoryService } from '../../common/entity/base-repository-impl';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from './category.interface.repository';

@Injectable()
export class CategoryRepositoryImpl
  extends BaseRepositoryService<Category>
  implements CategoryRepository
{
  constructor(@InjectRepository(Category) repository: Repository<Category>) {
    super(repository);
  }
}
