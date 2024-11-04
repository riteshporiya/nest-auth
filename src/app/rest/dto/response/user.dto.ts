import { ApiResponseProperty } from '@nestjs/swagger';
import { UserRole } from 'src/app/users/@types/users';

export class UserDTO {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  firstName: string;

  @ApiResponseProperty()
  lastName: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  role?: UserRole;
}
