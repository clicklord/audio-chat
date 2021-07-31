import { Module } from '@nestjs/common';

import { CookieHelper } from 'src/shared/utils';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { PasswordHelperService } from './passwordHelper.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [CookieHelper, PasswordHelperService],
  exports: [PasswordHelperService],
})
export class AuthModule {}
