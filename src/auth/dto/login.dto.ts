import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly login: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
