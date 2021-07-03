import { ArrayUnique, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class UpsertChatForUserDto {
  @IsOptional()
  readonly chatId: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  readonly userIds: string[];

  @IsNotEmpty()
  readonly chatTitle: string;

  @IsNotEmpty()
  readonly chatType: string;
}
