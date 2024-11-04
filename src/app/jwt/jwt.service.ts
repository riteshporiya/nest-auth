import { Inject, Injectable } from '@nestjs/common';
import { JWT_CONFIGURATION } from './constants';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { IJwtConfiguration } from './@types';
import { logAround } from '../logger/decorator/log-around';

@Injectable()
export class JwtService<T extends object> {
  constructor(
    @Inject(JWT_CONFIGURATION)
    private configService: ConfigService<IJwtConfiguration>,
  ) {}

  get accessTokenExpireIn(): number {
    return this.configService.get<number>('accessTokenExpireIn');
  }

  get refreshTokenExpireIn(): number {
    return this.configService.get<number>('refreshTokenExpireIn');
  }

  @logAround()
  signAccessToken(payload: T): string {
    return jwt.sign(
      payload,
      this.configService.get('privateKey'),
      this.configService.get('accessTokenOptions'),
    );
  }

  @logAround()
  signRefreshToken(payload: T): string {
    return jwt.sign(
      {
        ...payload,
        isRefreshToken: true,
      },
      this.configService.get('privateKey'),
      this.configService.get('refreshTokenOptions'),
    );
  }

  @logAround()
  validateAccessToken(token: string): T {
    return jwt.verify(token, this.configService.get('publicKey')) as T;
  }

  @logAround()
  validateRefreshToken(token: string): T {
    const { isRefreshToken, ...payload } = jwt.verify(
      token,
      this.configService.get('publicKey'),
    ) as T & { isRefreshToken: boolean };
    if (isRefreshToken) {
      return payload as T;
    }
    throw new Error('Invalid refresh token');
  }
}
