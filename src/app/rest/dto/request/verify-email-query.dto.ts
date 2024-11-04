import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailQueryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  verificationToken: string;

  @ApiPropertyOptional()
  redirectUrl?: string;
}
