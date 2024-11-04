import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { toBoolean } from 'src/app/common/helper/transformer';
import { PaginationFilter } from 'src/app/common/pagination';
import { FindSuperAdminOptions } from 'src/app/users/@types/users';

export class FindSuperAdminsReqDto
  extends PaginationFilter
  implements FindSuperAdminOptions
{
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @ApiPropertyOptional()
  search: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => toBoolean(value))
  @ApiPropertyOptional()
  excludeMe: boolean;
}
