import { ArrayUnique, IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  readonly chatType: string;
}
