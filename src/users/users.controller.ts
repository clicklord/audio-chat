import { Controller, Get, Query } from '@nestjs/common';
import { FindAllByIdsDto } from './dto';
import { UserShortInfo } from './interfaces';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('list')
  async userList(@Query() params: FindAllByIdsDto): Promise<UserShortInfo[]> {
    return await this.usersService.findByIds(params);
  }
}
