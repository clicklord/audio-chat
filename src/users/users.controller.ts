import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IServerResponse } from 'src/shared/interface';
import { ServerResponseHelper } from 'src/shared/utils';
import { FindAllByIdsDto, SearchByNameDto } from './dto';
import { UserShortInfo } from './interfaces';
import { UsersService } from './users.service';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('by-ids')
  async userList(
    @Query(ValidationPipe) params: FindAllByIdsDto,
  ): Promise<IServerResponse<UserShortInfo[]>> {
    return ServerResponseHelper.createSuccessResponse<UserShortInfo[]>(
      await this.usersService.findByIds(params),
    );
  }

  @Get('search-by-name')
  async searchUsers(
    @Query(ValidationPipe) params: SearchByNameDto,
  ): Promise<IServerResponse<UserShortInfo[]>> {
    return ServerResponseHelper.createSuccessResponse<UserShortInfo[]>(
      await this.usersService.searchUsers(params),
    );
  }
}
