import { ApiResponseProperty } from '@nestjs/swagger';

export class RegisterAPIResponse {
  @ApiResponseProperty()
  accessToken: string;

  @ApiResponseProperty()
  accessTokenExpireIn: number;

  @ApiResponseProperty()
  refreshToken: string;

  @ApiResponseProperty()
  refreshTokenExpireIn: number;

  @ApiResponseProperty()
  emailVerified: boolean;
}
