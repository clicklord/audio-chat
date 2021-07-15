import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { USER_COOKIE_NAME } from '../config';
import { ServerResponseHelper } from '../utils';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.cookies[USER_COOKIE_NAME]) {
      ServerResponseHelper.createFailedResponse(
        'Invalid cookie',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }
}
