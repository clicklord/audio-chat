import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { USER_COOKIE_NAME } from 'src/shared/config';
import { IUserCookie } from 'src/shared/interface';
import { UsersService } from 'src/users/users.service';
import { LoginDto, RegisterDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  @HttpCode(200)
  async register(
    @Res({ passthrough: true }) response: FastifyReply,
    @Body() params: RegisterDto,
  ): Promise<string> {
    const newUser = await this.usersService.registerNewUser(params);

    const cookieValue: IUserCookie = {
      id: newUser._id,
      login: newUser.login,
    };
    // TODO: move to common module
    response.setCookie(USER_COOKIE_NAME, JSON.stringify(cookieValue), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return newUser._id;
  }

  @Post('login')
  @HttpCode(200)
  async logIn(
    @Res({ passthrough: true }) response: FastifyReply,
    @Body() params: LoginDto,
  ): Promise<string> {
    const newUser = await this.usersService.findByLogin(params.login);

    const cookieValue: IUserCookie = {
      id: newUser._id,
      login: newUser.login,
    };
    // TODO: move to common module
    response.setCookie(USER_COOKIE_NAME, JSON.stringify(cookieValue), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return newUser._id;
  }

  @Get('logout')
  @HttpCode(200)
  async logOut(
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<void> {
    // TODO: move to common module
    response.setCookie(USER_COOKIE_NAME, '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });

    return;
  }
}
