import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchByNameDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly searchText: string;
}
