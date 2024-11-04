import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { toNumber } from 'src/app/common/helper/transformer';
import { SortOrder } from '../@types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationFilter {
  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @ApiPropertyOptional()
  @IsOptional()
  public page: number = 1;

  @Transform(({ value }) => toNumber(value, { default: 10, min: 1 }))
  @ApiPropertyOptional()
  @IsOptional()
  public pageSize: number = 10;

  @IsOptional()
  @ApiPropertyOptional()
  public orderBy?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  @ApiPropertyOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;
}
