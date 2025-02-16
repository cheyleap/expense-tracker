export interface PaginationResponse<T> {
  totalCount: number;
  data: T[];
}

export function isPaginationResponse<T>(
  object: any,
): object is PaginationResponse<T> {
  return object && 'totalCount' in object;
}

export interface PageMeta {
  keywords: string;
  totalCount: number;
  pageSize: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}

export interface ResponseData {
  id: number | string;
}

export interface Response {
  data?: ResponseData | ResponseData[];
  pageMeta?: PageMeta;
}
