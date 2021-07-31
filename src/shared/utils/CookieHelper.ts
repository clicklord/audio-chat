import { Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import * as jwt from 'jsonwebtoken';

import { USER_COOKIE_NAME } from '../config';
import { IUserCookie } from '../interface';

@Injectable()
export class CookieHelper {
  private tokenMaxAge = 60 * 60 * 24 * 7; // 1 week
  private tokenSecret = (process.env.TOKEN_SECRET = '123');

  setUserCookie(response: FastifyReply, cookieValue: IUserCookie): void {
    const cookieToken = jwt.sign(
      {
        exp: Date.now() + this.tokenMaxAge,
        data: JSON.stringify(cookieValue),
      },
      this.tokenSecret,
    );
    response.setCookie(USER_COOKIE_NAME, cookieToken, {
      httpOnly: true,
      path: '/',
      maxAge: this.tokenMaxAge,
    });
  }

  clearUserCookie(response: FastifyReply): void {
    response.setCookie(USER_COOKIE_NAME, '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });
  }

  verifyToken(cookieToken: string): IUserCookie | null {
    try {
      const decoded: any = jwt.verify(cookieToken, this.tokenSecret, {
        complete: true,
      });
      return (JSON.parse(decoded.payload.data) as IUserCookie) ?? null;
    } catch (err) {
      return null;
    }
  }

  getCookiePayload(cookieToken: string): IUserCookie | null {
    try {
      const decoded = jwt.decode(cookieToken, { complete: true });
      return (JSON.parse(decoded.payload.data) as IUserCookie) ?? null;
    } catch (err) {
      return null;
    }
  }
}
