import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { IServerResponse } from 'src/shared/interface';
import { CookieHelper, ServerResponseHelper } from 'src/shared/utils';
import { UsersService } from 'src/users/users.service';
import { LoginDto, RegisterDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private cookieHelper: CookieHelper,
  ) {}

  @Post('register')
  @HttpCode(200)
  async register(
    @Res({ passthrough: true }) response: FastifyReply,
    @Body() params: RegisterDto,
  ): Promise<IServerResponse<string>> {
    const newUser = await this.usersService.registerNewUser(params);
    this.cookieHelper.setUserCookie(response, {
      id: newUser._id,
      login: newUser.login,
    });

    return ServerResponseHelper.createSuccessResponse<string>(newUser._id);
  }

  @Post('login')
  @HttpCode(200)
  async logIn(
    @Res({ passthrough: true }) response: FastifyReply,
    @Body() params: LoginDto,
  ): Promise<IServerResponse<string>> {
    const newUser = await this.usersService.findByLogin(params.login);

    this.cookieHelper.setUserCookie(response, {
      id: newUser._id,
      login: newUser.login,
    });

    return ServerResponseHelper.createSuccessResponse<string>(newUser._id);
  }

  @Get('logout')
  @HttpCode(200)
  async logOut(
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<IServerResponse<void>> {
    this.cookieHelper.clearUserCookie(response);

    return ServerResponseHelper.createSuccessResponse<void>();
  }
}
