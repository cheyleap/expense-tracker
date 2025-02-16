import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Request } from 'express';
import { map, Observable } from 'rxjs';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
} from '../constants/pagination.constant';
import {
  isPaginationResponse,
  PaginationResponse,
  Response,
  ResponseData,
} from '../interfaces/response.interface';
import { RequestMethodEnums } from '../enums/reuqest-method.enum';
import { ResourceBadRequestException } from '../../exception-base/exception/bad-request.exception';

@Injectable()
export class ResponseMappingInterceptor<T extends ResponseData>
  implements NestInterceptor<T, Response>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    const request: Request = context.switchToHttp().getRequest();
    const { method, query } = request;
    if (query.exportFileType) {
      return next.handle();
    }
    const offset = Number(query.offset) || DEFAULT_PAGINATION_OFFSET;
    const limit = Number(query.limit) || DEFAULT_PAGINATION_LIMIT;
    const keywords = (query.keywords as string) ?? '';

    return next.handle().pipe(
      map((payload: T | PaginationResponse<T>) => {
        if (isPaginationResponse(payload)) {
          return this.mapPaginationResponse(payload, offset, limit, keywords);
        }
        return this.mapStandardResponse(payload, method);
      }),
    );
  }

  private mapPaginationResponse(
    payload: PaginationResponse<any>,
    offset: number,
    limit: number,
    keywords: string,
  ): Response {
    const totalCount = payload.totalCount ?? 0;
    const currentPage =
      offset >= totalCount ? 0 : Math.floor(offset / limit) + 1;
    const totalPage = Math.ceil(totalCount / limit);

    return {
      data: payload.data,
      pageMeta: {
        keywords,
        totalCount,
        pageSize: limit,
        currentPage,
        nextPage: currentPage >= totalPage ? null : currentPage + 1,
        prevPage: currentPage <= 1 ? null : currentPage - 1,
        lastPage: totalPage,
      },
    };
  }

  private mapStandardResponse(payload: any, method: string): Response {
    if (method === RequestMethodEnums.DELETE) return;

    if (payload?.id) {
      return { data: { id: payload.id } };
    }

    if (
      [
        RequestMethodEnums.POST,
        RequestMethodEnums.PUT,
        RequestMethodEnums.PATCH,
        RequestMethodEnums.GET,
      ].includes(method as RequestMethodEnums)
    ) {
      return { data: instanceToPlain(payload) as T };
    }

    throw new ResourceBadRequestException(
      'Interceptor',
      'Interceptor gone wrong!',
    );
  }
}
