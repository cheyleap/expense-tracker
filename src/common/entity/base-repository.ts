import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';
import { BasePaginationQueryDto } from '../dto/base-pagination-query.dto';
import { PaginationResponse } from '../interfaces/response.interface';

export interface BaseRepository<T> {
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
  ): Promise<PaginationResponse<T>>;

  find(options?: FindManyOptions<T>): Promise<T[]>;

  findOneById(id: number): Promise<T | null>;

  findOne(options: FindOneOptions<T>): Promise<T | null>;

  create(data: DeepPartial<T>): Promise<T>;

  update(entity: T): Promise<T | null>;

  delete(id: number): void;

  softDelete(id: number): void;
}
