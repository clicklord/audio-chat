import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto';
import { User, UserDocument } from 'src/schemas';
import { FindAllByIdsDto, SearchByNameDto } from './dto';
import { UserShortInfo } from './interfaces';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByIds(params: FindAllByIdsDto): Promise<UserShortInfo[]> {
    const foundUsers = await this.userModel
      .find({ _id: { $in: params.ids } })
      .exec();
    return this.formatToUserShortInfo(foundUsers);
  }

  async findByLogin(login: string): Promise<UserDocument> {
    return await this.userModel.findOne({ login: login }).exec();
  }

  async registerNewUser(params: RegisterDto): Promise<UserDocument> {
    const newUser = new this.userModel(params);
    return await newUser.save();
  }

  async searchUsers(params: SearchByNameDto): Promise<UserShortInfo[]> {
    const foundUsers = await this.userModel
      .find({
        $text: {
          $search: params.searchText,
          $caseSensitive: false,
          $diacriticSensitive: false,
        },
      })
      .exec();
    return this.formatToUserShortInfo(foundUsers);
  }

  private formatToUserShortInfo(users: UserDocument[]) {
    return users.map((val: UserDocument) => {
      return { id: val._id, name: val.name };
    });
  }
}
