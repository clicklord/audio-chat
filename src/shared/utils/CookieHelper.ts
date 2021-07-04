import { Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { USER_COOKIE_NAME } from '../config';
import { IUserCookie } from '../interface';

@Injectable()
export class CookieHelper {
  setUserCookie(response: FastifyReply, cookieValue: IUserCookie): void {
    response.setCookie(USER_COOKIE_NAME, JSON.stringify(cookieValue), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  }

  clearUserCookie(response: FastifyReply): void {
    response.setCookie(USER_COOKIE_NAME, '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });
  }
}
