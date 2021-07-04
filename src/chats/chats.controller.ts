import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from 'src/shared/guards';
import { IUserCookie } from 'src/shared/interface';
import { ChatsService } from './chats.service';
import { DeleteByIdsDto, UpsertChatForUserDto } from './dto';
import { GetUserFromCookie } from './decorators';
import { IChatShortInfo } from './interfaces';

@ApiTags('chat')
@Controller('chat')
@UseGuards(AuthGuard)
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post('/user/upsert')
  @HttpCode(200)
  async upsert(
    @Body() params: UpsertChatForUserDto,
    @GetUserFromCookie() curentUser: IUserCookie,
  ): Promise<IChatShortInfo> {
    const upsertedId = await this.chatsService.upsertOneForUser(
      curentUser.id,
      params,
    );
    const foundChat = await this.chatsService.findById(upsertedId);
    return {
      id: foundChat._id,
      title: foundChat.title,
      type: foundChat.type,
      users: foundChat.users,
    };
  }

  @Get('/user/list')
  async chatsForUser(
    @GetUserFromCookie() curentUser: IUserCookie,
  ): Promise<IChatShortInfo[]> {
    const foundChats = await this.chatsService.findByUserId(curentUser.id);
    return foundChats.map((val) => {
      return {
        id: val._id,
        title: val.title,
        type: val.type,
        users: val.users,
      };
    });
  }

  @Delete('/user/by-ids')
  @HttpCode(200)
  async deleteByIds(
    @Query(new ValidationPipe({ transform: true })) params: DeleteByIdsDto,
  ): Promise<void> {
    this.chatsService.deleteByIds(params);
    return;
  }
}
