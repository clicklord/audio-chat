import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import * as cookie from 'cookie';
import { Socket, Server } from 'socket.io';
import { WSEvents } from './enums';
import { IChatConnection } from './interfaces';
import { ChatsService } from 'src/chats/chats.service';
import { IServerResponse, IUserCookie } from 'src/shared/interface';
import { AuthGuard } from 'src/shared/guards';
import { USER_COOKIE_NAME } from 'src/shared/config';

@Injectable()
@UseGuards(AuthGuard)
@WebSocketGateway({
  path: '/live',
  cors: {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders:
      'Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With',
  },
})
export class ChatEventsGateway implements OnGatewayDisconnect {
  constructor(private chatsService: ChatsService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage(WSEvents.connectToChat)
  handleConnectToChat(client: Socket, payload: string): void {
    const payloadData: IChatConnection = JSON.parse(payload);
    if (!payloadData || !payloadData.chatId) {
      this.sendErrorToClientList(
        [client.id],
        {
          event: WSEvents.connectToChat,
        },
        new Error('invalid payload'),
      );
      return;
    }

    const currentUserId = this.getUserIdFromCookie(client);
    if (!currentUserId) {
      this.sendErrorToClientList(
        [client.id],
        {
          event: WSEvents.connectToChat,
        },
        new Error('invalid cookie format'),
      );
      return;
    }
    if (
      !this.chatsService.addActiveUser(
        currentUserId,
        client.id,
        payloadData.chatId,
      )
    ) {
      this.sendErrorToClientList(
        [client.id],
        {
          event: WSEvents.connectToChat,
        },
        new Error('failed to set active user'),
      );
      return;
    }

    this.sendToClientList(
      [client.id],
      {
        event: WSEvents.connectToChat,
      },
    );
  }

  @SubscribeMessage(WSEvents.disconnectFromChat)
  handleDisconnectFromChat(client: Socket, payload: string): void {
    const payloadData: IChatConnection = JSON.parse(payload);
    if (!payloadData || !payloadData.chatId) {
      this.sendErrorToClientList(
        [client.id],
        {
          event: WSEvents.disconnectFromChat,
        },
        new Error('invalid payload'),
      );
      return;
    }

    if (!this.chatsService.removeActiveUser(client.id, payloadData.chatId)) {
      this.sendErrorToClientList(
        [client.id],
        {
          event: WSEvents.disconnectFromChat,
        },
        new Error('failed to disconnect active user'),
      );
      return;
    }
    this.sendToClientList(
      [client.id],
      {
        event: WSEvents.disconnectFromChat,
      },
    );
  }

  handleDisconnect(client: Socket) {
    if (!this.chatsService.removeActiveUserFromAllChats(client.id)) {
      this.logger.log(`Error disconnect form chats by client: ${client.id}`);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  sendToClientList(clienList: string[], data: any) {
    this.server
      .to(clienList)
      .emit(WSEvents.messageToClient, this.createSuccessAnswer(data));
  }

  sendErrorToClientList(clienList: string[], data: any, err: Error) {
    this.server
      .to(clienList)
      .emit(WSEvents.messageToClient, this.createErrorAnswer(data, err));
  }

  private createSuccessAnswer(data: Record<string, any>) {
    const response: IServerResponse<Record<string, any>> = {
      success: true,
      data,
      error: null,
    };
    return JSON.stringify(response);
  }

  private createErrorAnswer(data: Record<string, any>, err: Error) {
    const response: IServerResponse<Record<string, any>> = {
      success: false,
      data,
      error: err.message,
    };
    return JSON.stringify(response);
  }

  private getUserIdFromCookie(client: Socket): string | null {
    const rawCookie = cookie.parse(client.handshake.headers.cookie);
    const cookieData = rawCookie[USER_COOKIE_NAME] ?? null;
    if (!cookieData) {
      return cookieData;
    }
    return (JSON.parse(cookieData) as IUserCookie).id;
  }
}
