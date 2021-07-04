import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChatType } from '../enums';

export class UpsertChatForUserDto {
  @ApiProperty()
  @IsOptional()
  readonly chatId: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  readonly userIds: string[];

  @ApiProperty()
  @IsNotEmpty()
  readonly chatTitle: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(Object.keys(ChatType))
  readonly chatType: string;
}
