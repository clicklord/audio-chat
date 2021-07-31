import { HttpException, HttpStatus } from '@nestjs/common';

import { IServerResponse } from '../interface';

export class ServerResponseHelper {
  static createSuccessResponse<T>(data?: T): IServerResponse<T> {
    return {
      success: true,
      data: data ?? null,
      error: null,
    };
  }

  static createFailedResponse(msg: string, errorCode?: number) {
    throw new HttpException(msg, errorCode ?? HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
