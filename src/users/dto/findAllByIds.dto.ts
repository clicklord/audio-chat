import { IsArray, IsNotEmpty } from 'class-validator';

export class FindAllByIdsDto {
  @IsNotEmpty()
  @IsArray()
  readonly ids: string[];
}
