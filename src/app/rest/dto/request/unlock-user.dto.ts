import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UnlockUserAPIBody {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
