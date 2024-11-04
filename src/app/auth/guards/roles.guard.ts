import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../constants';
import { AuthorizeResType } from '../@types';
import { ErrorCode } from 'src/app/exceptions/error-codes';
import { CustomExceptionFactory } from 'src/app/exceptions/custom-exception.factory';
import { UserRole } from 'src/app/users/@types/users';
import { logAround } from 'src/app/logger/decorator/log-around';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  @logAround()
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const userAuthData = request.authData;
    const isAccessible = this.matchRoles(roles, userAuthData);
    if (!isAccessible) {
      throw CustomExceptionFactory.create(ErrorCode.FORBIDDEN);
    }
    return isAccessible;
  }

  @logAround()
  private matchRoles(roles: UserRole[], user: AuthorizeResType) {
    if (!user) return false;
    return roles.some((role) => user.role === role);
  }
}
