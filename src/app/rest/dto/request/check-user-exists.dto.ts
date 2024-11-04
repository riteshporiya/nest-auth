import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CheckUserExistsAPIBody {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
