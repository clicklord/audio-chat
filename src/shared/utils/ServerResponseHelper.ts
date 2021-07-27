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
    throw new HttpException(
      {
        success: false,
        data: null,
        error: msg,
      },
      errorCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
