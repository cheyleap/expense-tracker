import { BaseRepository } from './base-repository';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { PaginationResponse } from '../interfaces/response.interface';
import { BasePaginationQueryDto } from '../dto/base-pagination-query.dto';
import { GetPaginationUtil } from '../utils/get-pagination.util';

export class BaseRepositoryService<T> implements BaseRepository<T> {
  constructor(private readonly repository: Repository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity: T = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findOneById(id: number): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return await this.repository.findOne(options);
  }

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async update(entity: T): Promise<T | null> {
    return await this.repository.save(entity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async softDelete(id: number): Promise<void | null> {
    await this.repository.softDelete(id);
  }

  findWithPagination(
    pagination: BasePaginationQueryDto,
    searchableColumns: string[],
    options?: {
      where?: FindOptionsWhere<T>;
      select?: FindOptionsSelect<T>;
      relation?: FindOptionsRelations<T>;
      orderBy?: FindOptionsOrder<T>;
      mapFunction?: (data: T, index?: number) => any;
    },
  ): Promise<PaginationResponse<T>> {
    return GetPaginationUtil(
      this.repository,
      pagination,
      searchableColumns,
      options,
    );
  }
}
