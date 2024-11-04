import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserAuthData = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.authData;
  },
);
