import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChatType } from 'src/chats/enums';

export class SendMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly chatId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(Object.keys(ChatType))
  readonly msgType: 'text' | 'voice';

  @ApiProperty()
  @IsNotEmpty()
  readonly data: string;
}
