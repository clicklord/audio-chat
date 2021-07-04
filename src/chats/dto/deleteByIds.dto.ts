import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteByIdsDto {
  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  readonly ids: string | string[];
}
