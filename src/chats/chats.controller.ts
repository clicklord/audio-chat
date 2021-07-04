import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { USER_COOKIE_NAME } from 'src/shared/config';
import { AuthGuard } from 'src/shared/guards';
import { IUserCookie } from 'src/shared/interface';
import { ChatsService } from './chats.service';
import { DeleteByIdsDto, UpsertChatForUserDto } from './dto';
import { IChatShortInfo } from './interfaces';

@ApiTags('chat')
@Controller('chat')
@UseGuards(AuthGuard)
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post('/user/upsert')
  @HttpCode(200)
  async upsert(
    @Req() request: FastifyRequest,
    @Body() params: UpsertChatForUserDto,
  ): Promise<IChatShortInfo> {
    const curentUserId = (
      JSON.parse(request.cookies[USER_COOKIE_NAME]) as unknown as IUserCookie
    ).id;
    const upsertedId = await this.chatsService.upsertOneForUser(
      curentUserId,
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
    @Req() request: FastifyRequest,
  ): Promise<IChatShortInfo[]> {
    const curentUserId = (
      JSON.parse(request.cookies[USER_COOKIE_NAME]) as unknown as IUserCookie
    ).id;
    const foundChats = await this.chatsService.findByUserId(curentUserId);
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
