import { ApiResponseProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiResponseProperty()
  readonly totalItems: number;
  @ApiResponseProperty()
  readonly itemCount: number;
  @ApiResponseProperty()
  readonly itemsPerPage: number;
  @ApiResponseProperty()
  readonly totalPages: number;
  @ApiResponseProperty()
  readonly currentPage: number;
}
