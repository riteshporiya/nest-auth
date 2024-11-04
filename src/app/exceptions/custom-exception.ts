import { HttpException } from '@nestjs/common';
import { ErrorCode } from './error-codes';

export class CustomException extends HttpException {
  code: ErrorCode;
  timestamp: Date;

  constructor(
    response: string | Record<string, any>,
    status: number,
    code: ErrorCode,
  ) {
    super(response, status);
    this.code = code;
    this.timestamp = new Date();
  }
}
