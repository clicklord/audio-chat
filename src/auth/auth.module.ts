import { Module } from '@nestjs/common';

import { CookieHelper } from 'src/shared/utils';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [CookieHelper],
})
export class AuthModule {}
