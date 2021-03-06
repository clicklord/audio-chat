import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as cookie from 'cookie';
import { Observable } from 'rxjs';

import { USER_COOKIE_NAME } from '../config';
import { CookieHelper, ServerResponseHelper } from '../utils';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() === 'ws') {
      this.parseWsCookie(context);
    } else {
      this.parseHttpCookie(context);
    }
    return true;
  }

  parseWsCookie(context: ExecutionContext) {
    const clientData = context.switchToWs().getClient();
    const cookies = cookie.parse(clientData.handshake.headers.cookie ?? '');
    if (!cookies || !cookies[USER_COOKIE_NAME]) {
      throw new WsException({
        success: false,
        data: null,
        error: 'Invalid cookie',
      });
    }

    const tokenPayload = new CookieHelper().verifyToken(cookies[USER_COOKIE_NAME]);
    if (!tokenPayload) {
      throw new WsException({
        success: false,
        data: null,
        error: 'Invalid cookie',
      });
    }
  }

  parseHttpCookie(context: ExecutionContext) {
    const cookies = context.switchToHttp().getRequest().cookies;
    if (!cookies || !cookies[USER_COOKIE_NAME]) {
      ServerResponseHelper.createFailedResponse(
        'Invalid cookie',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tokenPayload = new CookieHelper().verifyToken(cookies[USER_COOKIE_NAME]);
    if (!tokenPayload) {
      ServerResponseHelper.createFailedResponse(
        'Invalid cookie',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
