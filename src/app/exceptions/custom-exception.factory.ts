import { logAround } from '../logger/decorator/log-around';
import { CustomException } from './custom-exception';
import { defaultErrorMessages } from './default-error-messages';
import { ErrorCode } from './error-codes';
import { WrongCredentialsException } from './wrong-credentials';

export class CustomExceptionFactory {
  @logAround()
  public static create(
    code: ErrorCode,
    message?: string,
    statusCode?: number,
  ): CustomException {
    if (code === ErrorCode.WRONG_CREDENTIALS) {
      return new WrongCredentialsException(message);
    }
    return new CustomException(
      message || defaultErrorMessages[code].message,
      statusCode || defaultErrorMessages[code].statusCode,
      code,
    );
  }
}
