import { PaginationMetaDto } from 'src/app/common/pagination';
import { UserDTO } from './user.dto';
import { ApiResponseProperty } from '@nestjs/swagger';

export class FindCompanyUsersResDto {
  @ApiResponseProperty({ type: [UserDTO] })
  items: UserDTO[];

  @ApiResponseProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
