import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHelperService {
  private hashRounds = 10;

  public async genPasswordHash(password: string) {
    return bcrypt.hash(password, this.hashRounds);
  }

  public async isValidPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}