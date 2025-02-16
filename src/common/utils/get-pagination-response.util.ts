import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PageMetaDto {
  @ApiProperty({ type: Number })
  public total: number;

  @ApiProperty({ type: Number })
  public skip: number;

  @ApiProperty({ type: Number })
  public limit: number;

  @ApiProperty({ type: Number })
  public orderBy: string;

  @ApiProperty({ type: Number })
  public totalPage: number;
}

export class GetPaginationResponseDto<T> {
  @ApiProperty({ type: Object, isArray: true })
  public data: T[];

  @ApiPropertyOptional({ type: PageMetaDto })
  public pageMeta?: PageMetaDto;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type Entity = Function;

export function getPaginationResponseDto(
  type: Entity,
): typeof GetPaginationResponseDto {
  class PaginationResponseDto<T> extends GetPaginationResponseDto<T> {
    @ApiProperty({ type, isArray: true })
    public data: T[];
  }

  Object.defineProperty(PaginationResponseDto, 'name', {
    value: `${type.name}PaginationResponseDto`,
  });

  return PaginationResponseDto;
}
