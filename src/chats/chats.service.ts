import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from 'src/schemas';
import { DeleteByIdsDto, UpsertChatForUserDto } from './dto';

@Injectable()
export class ChatsService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async upsertOneForUser(
    currentyUserId: string,
    params: UpsertChatForUserDto,
  ): Promise<string> {
    if (!params.chatId) {
      const userIds = params.userIds ?? [];
      userIds.push(currentyUserId);
      const createResult = await this.createOne({
        ...params,
        userIds,
      });
      return createResult._id;
    }
    if (await this.updateOneById(params)) {
      return params.chatId;
    }
  }

  async createOne(params: UpsertChatForUserDto): Promise<ChatDocument> {
    const createdChat = new this.chatModel({
      title: params.chatTitle,
      type: params.chatType,
      users: params.userIds,
    });
    return await createdChat.save();
  }

  async updateOneById(params: UpsertChatForUserDto): Promise<boolean> {
    const updateFields: Record<string, string | string[]> = {};
    if (params.chatTitle) {
      updateFields.title = params.chatTitle;
    }
    if (params.chatType) {
      updateFields.type = params.chatType;
    }
    if (params.userIds) {
      updateFields.users = params.userIds;
    }
    const updateResult = await this.chatModel.updateOne(
      {
        _id: params.chatId,
      },
      {
        $set: updateFields,
      },
    );
    return updateResult.nModified !== 0 ?? false;
  }

  async findById(id: string): Promise<ChatDocument> {
    return this.chatModel.findById(id);
  }

  async findByUserId(userId: string): Promise<ChatDocument[]> {
    return this.chatModel.find({ users: userId });
  }

  async findByActiveUserKey(userKey: string): Promise<ChatDocument[]> {
    return this.chatModel.find({ 'activeUsers.userId': userKey });
  }

  async deleteByIds(params: DeleteByIdsDto) {
    const result = await this.chatModel.deleteMany({ _id: params.ids });
    return result.deletedCount !== 0;
  }

  async addActiveUser(
    userId: string,
    activeUserId: string,
    chatId: string,
  ): Promise<boolean> {
    const foundChat = await this.findById(chatId);
    const activeUsersWithoutCurrent = foundChat.activeUsers.filter(
      val => val.userId !== userId,
    );
    const updatedActiveUsers = [
      ...new Set(
        activeUsersWithoutCurrent.concat({
          userId,
          userKey: activeUserId,
        }),
      ),
    ];
    const updateResult = await this.chatModel.updateOne(
      {
        _id: chatId,
      },
      {
        $set: { activeUsers: updatedActiveUsers },
      },
    );
    return updateResult.nModified !== 0 ?? false;
  }

  async removeActiveUser(
    activeUserKey: string,
    chatId: string,
  ): Promise<boolean> {
    const foundChat = await this.findById(chatId);
    const allActiveUsers = foundChat.activeUsers.filter(
      val => val.userKey !== activeUserKey,
    );
    const updateResult = await this.chatModel.updateOne(
      {
        _id: chatId,
      },
      {
        $set: { activeUsers: allActiveUsers },
      },
    );
    return updateResult.nModified !== 0 ?? false;
  }

  async removeActiveUserFromAllChats(activeUserKey: string): Promise<boolean> {
    const foundChats = await this.findByActiveUserKey(activeUserKey);
    const updateActions = [];
    for (const foundChat of foundChats) {
      const allActiveUsers = foundChat.activeUsers.filter(
        val => val.userKey !== activeUserKey,
      );
      updateActions.push(
        this.chatModel.updateOne(
          {
            _id: foundChat._id,
          },
          {
            $set: { activeUsers: allActiveUsers },
          },
        ),
      );
    }
    const updateResults = await Promise.all(updateActions);
    let totalResult = true;
    for (const updateResult of updateResults) {
      if (!(updateResult.nModified !== 0 ?? false)) {
        totalResult = false;
        break;
      }
    }
    return totalResult;
  }
}
