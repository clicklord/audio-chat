import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IServerResponse } from 'src/shared/interface';
import { ServerResponseHelper } from 'src/shared/utils';

import { FindAllByIdsDto } from './dto';
import { UserShortInfo } from './interfaces';
import { UsersService } from './users.service';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('list')
  async userList(
    @Query(ValidationPipe) params: FindAllByIdsDto,
  ): Promise<IServerResponse<UserShortInfo[]>> {
    return ServerResponseHelper.createSuccessResponse<UserShortInfo[]>(
      await this.usersService.findByIds(params),
    );
  }
}
