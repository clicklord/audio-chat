import { createParamDecorator } from '@nestjs/common';
import { USER_COOKIE_NAME } from 'src/shared/config';
import { IUserCookie } from 'src/shared/interface';
import { CookieHelper } from 'src/shared/utils';

export const GetUserFromCookie = createParamDecorator(
  (_data, request) =>
    new CookieHelper().getCookiePayload(
      request.args[0].cookies[USER_COOKIE_NAME],
    ) as unknown as IUserCookie,
);
