import { CustomException } from './custom-exception';
import { defaultErrorMessages } from './default-error-messages';
import { ErrorCode } from './error-codes';

export class WrongCredentialsException extends CustomException {
  constructor(message?: string) {
    super(
      message || defaultErrorMessages[ErrorCode.WRONG_CREDENTIALS].message,
      defaultErrorMessages[ErrorCode.WRONG_CREDENTIALS].statusCode,
      ErrorCode.WRONG_CREDENTIALS,
    );
  }
}
