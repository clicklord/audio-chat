import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllByIdsDto {
  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  readonly ids: string[];
}
