import { instanceToPlain } from 'class-transformer';
import {
  EntityPropertyNotFoundError,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  ILike,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import * as _ from 'lodash';
import { Logger } from '@nestjs/common';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
} from '../constants/pagination.constant';
import { PaginationResponse } from '../interfaces/response.interface';
import { BasePaginationQueryDto } from '../dto/base-pagination-query.dto';
import { ResourceBadRequestException } from '../../exception-base/exception/bad-request.exception';
import { PAGINATION_ORDER_DIRECTION } from '../enums/pagination-order-direction.enum';

export async function GetPagination<
  T extends ObjectLiteral,
  U extends ObjectLiteral,
  V,
>(
  repo: Repository<T>,
  paginationQuery: BasePaginationQueryDto,
  searchableColumns: string[],
  options?: {
    childSearchColumn?: string;
    childWhere?: FindOptionsWhere<U>;
    where?: FindOptionsWhere<T>;
    select?: FindOptionsSelect<T>;
    relation?: FindOptionsRelations<T>;
    orderBy?: FindOptionsOrder<T>;
    mapFunction?: (input: T, index?: number) => V;
  },
) {
  const { offset, limit, keywords, orderBy } = paginationQuery;

  const searchKeywords: FindOptionsWhere<T>[] = keywords
    ? handleFullTextSearch(searchableColumns, keywords)
    : [];

  const whereCondition = options?.where ?? ({} as FindOptionsWhere<T>);
  const sortableColumns = _.merge(
    {},
    options?.orderBy,
    handleSortableColumns(orderBy) as FindOptionsOrder<T>,
  );

  const paginationOptions = {
    skip: offset ?? DEFAULT_PAGINATION_OFFSET,
    take: limit ?? DEFAULT_PAGINATION_LIMIT,
    where: handleFindOptionsWhere(searchKeywords, whereCondition),
    select: options?.select ?? {},
    order: sortableColumns,
    relations: options?.relation ?? {},
  };

  if (!limit) {
    paginationOptions.take = 0;
  }

  try {
    const [data, totalCount] = await repo.findAndCount(paginationOptions);
    return {
      totalCount,
      data: options?.mapFunction
        ? await Promise.all(
            data
              .map((record: T, index: number) =>
                options.mapFunction!(record, index),
              )
              .filter((record: V) => record != null),
          )
        : instanceToPlain(data),
    } as PaginationResponse<T>;
  } catch (error) {
    if (error instanceof EntityPropertyNotFoundError) {
      Logger.error('Invalid column error:', error);
      throw new ResourceBadRequestException(
        'keyword',
        'Invalid column name or property',
      );
    }
    throw error;
  }
}

export function handleFullTextSearch(
  searchableColumns: string[],
  keyword: string,
): object[] {
  return searchableColumns.map((column) =>
    generateFullTextSearchCondition(column, keyword),
  );
}

function generateFullTextSearchCondition(
  column: string,
  keyword: string,
): object {
  if (column.includes('.')) {
    const queryObject: any = JSON.parse(
      generateQueryFullTextSearch(column, keyword),
    );
    return applyFullTextSearchToObject(queryObject, keyword);
  } else {
    return { [column]: ILike(`%${keyword}%`) };
  }
}

function applyFullTextSearchToObject(
  queryObject: object,
  keyword: string,
): object {
  Object.entries(queryObject).forEach(([key, value]) => {
    if (typeof value === 'object') {
      applyFullTextSearchToObject(value, keyword);
    } else {
      queryObject[key] = ILike(`%${keyword}%`);
    }
  });
  return queryObject;
}

function generateQueryFullTextSearch(
  searchColumn: string,
  keyword: string,
): string {
  return searchColumn
    .split('.')
    .reduceRight((acc, column) => `{"${column}":${acc}}`, `"${keyword}"`);
}

export function handleFindOptionsWhere(
  searchArray: FindOptionsWhere<any>[],
  whereCondition: FindOptionsWhere<any>,
) {
  if (searchArray.length) {
    return searchArray
      .map((keyword) =>
        Array.isArray(whereCondition)
          ? whereCondition.map((condition) => _.merge(keyword, condition))
          : _.merge(keyword, whereCondition),
      )
      .flat();
  }

  return Array.isArray(whereCondition) ? whereCondition : [whereCondition];
}

export function generateSortableColumnQuery(
  sortColumn: string,
  sortDirection: string,
): string {
  return sortColumn
    .split('.')
    .reduceRight((acc, column) => `{"${column}":${acc}}`, `"${sortDirection}"`);
}

export function handleSortableColumns(orderBy?: string) {
  if (!orderBy) {
    return { id: PAGINATION_ORDER_DIRECTION.DESC };
  }

  return orderBy
    .split(',')
    .map((sortableColumns) =>
      sortableColumns.split(' ').map((sortField) => {
        const [sortColumn, sortDirection] = sortField.split(':');
        return JSON.parse(
          generateSortableColumnQuery(sortColumn, sortDirection),
        );
      }),
    )
    .flat()
    .reduce((acc, obj) => _.merge(acc, obj), {});
}
