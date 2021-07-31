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
import { IServerResponse, IUserCookie } from 'src/shared/interface';
import { ChatsService } from './chats.service';
import { DeleteByIdsDto, UpsertChatForUserDto } from './dto';
import { GetUserFromCookie } from './decorators';
import { IChatShortInfo } from './interfaces';
import { ServerResponseHelper } from 'src/shared/utils';

@ApiTags('chat')
@Controller('chat')
@UseGuards(AuthGuard)
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post('/upsert')
  @HttpCode(200)
  async upsert(
    @Body() params: UpsertChatForUserDto,
    @GetUserFromCookie() curentUser: IUserCookie,
  ): Promise<IServerResponse<IChatShortInfo>> {
    const upsertedId = await this.chatsService.upsertOneForUser(
      curentUser.id,
      params,
    );
    const foundChat = await this.chatsService.findById(upsertedId);
    return ServerResponseHelper.createSuccessResponse<IChatShortInfo>({
      id: foundChat._id,
      title: foundChat.title,
      type: foundChat.type,
      users: foundChat.users,
    });
  }

  @Get('/by-participant')
  async chatsForUser(
    @GetUserFromCookie() curentUser: IUserCookie,
  ): Promise<IServerResponse<IChatShortInfo[]>> {
    const foundChats = await this.chatsService.findByUserId(curentUser.id);
    return ServerResponseHelper.createSuccessResponse<IChatShortInfo[]>(
      foundChats.map(val => ({
        id: val._id,
        title: val.title,
        type: val.type,
        users: val.users,
      })),
    );
  }

  @Delete('/by-ids')
  @HttpCode(200)
  async deleteByIds(
    @Query(new ValidationPipe({ transform: true })) params: DeleteByIdsDto,
  ): Promise<IServerResponse<void>> {
    this.chatsService.deleteByIds(params);
    return ServerResponseHelper.createSuccessResponse<void>();
  }
}
