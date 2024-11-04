import { ApiResponseProperty } from '@nestjs/swagger';
import { UserRole } from 'src/app/users/@types/users';

export class LoginAPIResponse {
  @ApiResponseProperty()
  accessToken: string;

  @ApiResponseProperty()
  refreshToken: string;

  @ApiResponseProperty()
  expiresIn: number;

  @ApiResponseProperty()
  emailVerified: boolean;

  @ApiResponseProperty({ enum: UserRole })
  role: UserRole;
}
