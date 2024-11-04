import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class DeleteUserAPIBody {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
