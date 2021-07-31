import { HttpStatus } from '@nestjs/common';
import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { IServerResponse } from 'src/shared/interface';
import { CookieHelper, ServerResponseHelper } from 'src/shared/utils';
import { UsersService } from 'src/users/users.service';
import { LoginDto, RegisterDto } from './dto';
import { PasswordHelperService } from './passwordHelper.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private cookieHelper: CookieHelper,
    private passwordHelperService: PasswordHelperService,
  ) {}

  @Post('register')
  @HttpCode(200)
  async register(
    @Res({ passthrough: true }) response: FastifyReply,
    @Body() params: RegisterDto,
  ): Promise<IServerResponse<string>> {
    const newUser = await this.usersService.registerNewUser({
      ...params,
      password: await this.passwordHelperService.genPasswordHash(
        params.password,
      ),
    });
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

    if (!newUser) {
      ServerResponseHelper.createFailedResponse(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isValidPassword = await this.passwordHelperService.isValidPassword(
      params.password,
      newUser.password,
    );

    if (!isValidPassword) {
      ServerResponseHelper.createFailedResponse(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

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
