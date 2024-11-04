export enum ErrorCode {
  USER_ALREADY_EXISTS = 'register.user_already_exists',
  EMAIL_IN_USE = 'user.email_in_use',
  WRONG_CREDENTIALS = 'login.wrong_credentials',
  BAD_VERIFICATION_REQUEST = 'email-verification.bad-request',
  USER_NOT_FOUND = 'user.not-found',
  CAPTCHA_TOKEN_VERIFICATION_FAILED = 'captcha.token verification-failed',
  NOT_AUTHORIZED = 'auth.not-authorized',
  FORBIDDEN = 'auth.forbidden',
  INTERNAL_SERVER_ERROR = 'server.internal-server-error',
  PASSWORD_RESET_TOKEN_EXPIRED_OR_INVALID = 'password-reset.token-expired-or-invalid',
  PASSWORD_RESET_TOKEN_INVALID = 'password-reset.token-invalid',
  TOO_MANY_REQUESTS = 'auth.too-many-requests',
  INVALID_INVITE_TOKEN = 'invite.invalid-token',
  WRONG_PASSWORD_FOR_EDIT_USER = 'user.wrong-password-for-edit-user',
  VALIDATION_ERROR = 'validation.error',
  MAX_USERS_REACHED = 'user.max-users-reached',
  USER_COUNT_WILL_EXCEED_LIMIT = 'user.user-count-will-exceed-limit',
}

export enum ReCaptchaActionType {
  REGISTER_USER = 'REGISTER_USER',
  USER_FORGOT_PASSWORD = 'USER_FORGOT_PASSWORD',
}
