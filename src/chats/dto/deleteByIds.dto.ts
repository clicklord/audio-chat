import { IsNotEmpty } from 'class-validator';

export class DeleteByIdsDto {
  @IsNotEmpty()
  readonly ids: string | string[];
}
