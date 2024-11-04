import { ApiResponseProperty } from '@nestjs/swagger';

export class CheckUserExistsAPIResponse {
  @ApiResponseProperty()
  exists: boolean;
}
