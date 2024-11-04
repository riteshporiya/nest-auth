import { ApiResponseProperty } from '@nestjs/swagger';
import { UserRole } from 'src/app/users/@types/users';

export class CurrentUserAPIResponse {
  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  firstName: string;

  @ApiResponseProperty()
  lastName: string;

  @ApiResponseProperty({ enum: UserRole })
  role: UserRole;
}
