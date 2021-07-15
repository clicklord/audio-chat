import { Module } from '@nestjs/common';
import { ChatsModule } from 'src/chats/chats.module';
import { ChatEventsController } from './chat-events.controller';
import { ChatEventsGateway } from './chat-events.gateway';

@Module({
  imports: [ChatsModule],
  controllers: [ChatEventsController],
  providers: [ChatEventsGateway],
})
export class ChatEventsModule {}
