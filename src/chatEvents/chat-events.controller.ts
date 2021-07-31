import { Post } from '@nestjs/common';
import { HttpCode } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatsService } from 'src/chats/chats.service';
import { GetUserFromCookie } from 'src/chats/decorators';
import { IChatShortInfo } from 'src/chats/interfaces';
import { AuthGuard } from 'src/shared/guards';
import { IServerResponse, IUserCookie } from 'src/shared/interface';
import { ServerResponseHelper } from 'src/shared/utils';
import { ChatEventsGateway } from './chat-events.gateway';
import { SendMessageDto } from './dto/sendMessage.dto';

@ApiTags('chat-events')
@Controller('chat-events')
@UseGuards(AuthGuard)
export class ChatEventsController {
  constructor(
    private chatsService: ChatsService,
    private chatEventsGateway: ChatEventsGateway,
  ) {}

  @Post('/send')
  @HttpCode(200)
  async sendToChat(
    @Body() params: SendMessageDto,
    @GetUserFromCookie() curentUser: IUserCookie,
  ): Promise<IServerResponse<IChatShortInfo>> {
    const foundChat = await this.chatsService.findById(params.chatId);
    const userKeys = foundChat.activeUsers
      .filter(val => val.userId !== curentUser.id)
      .map(val => val.userKey);
    this.chatEventsGateway.sendToClientList(userKeys, {
      chatId: params.chatId,
      data: params.data,
    });
    return ServerResponseHelper.createSuccessResponse<null>(null);
  }
}
