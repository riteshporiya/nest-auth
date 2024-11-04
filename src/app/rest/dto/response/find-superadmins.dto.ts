import { ApiResponseProperty } from '@nestjs/swagger';
import { UserDTO } from './user.dto';
import { PaginationMetaDto } from 'src/app/common/pagination';

export class FindSuperAdminsResDto {
  @ApiResponseProperty({ type: [UserDTO] })
  items: UserDTO[];

  @ApiResponseProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
