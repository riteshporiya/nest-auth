import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { convertExpireInToMilliSeconds } from '../common/helper/util';
import { IJwtConfiguration } from '../jwt/@types';

export const jwtConfig = async () => {
  let accessTokenExpireIn = 0;
  let refreshTokenExpireIn = 0;
  let privateKey = '';
  let publicKey = '';
  if (!process.env.JWT_ACCESS_EXPIRES_IN) {
    throw new Error(
      'JWT_ACCESS_EXPIRES_IN environment variable is not defined.',
    );
  } else {
    accessTokenExpireIn = convertExpireInToMilliSeconds(
      process.env.JWT_ACCESS_EXPIRES_IN,
    );
  }
  if (!process.env.JWT_REFRESH_EXPIRES_IN) {
    throw new Error(
      'JWT_REFRESH_EXPIRES_IN environment variable is not defined.',
    );
  } else {
    refreshTokenExpireIn = convertExpireInToMilliSeconds(
      process.env.JWT_REFRESH_EXPIRES_IN,
    );
  }
  if (!process.env.AUTH_PRIVATE_KEY) {
    if (!process.env.AUTH_PRIVATE_KEY_PATH) {
      throw new Error('PRIVATE_KEY_PATH environment variable is not defined.');
    } else {
      privateKey = fs.readFileSync(process.env.AUTH_PRIVATE_KEY_PATH, 'utf8');
    }
  }
  if (!process.env.AUTH_PUBLIC_KEY) {
    if (!process.env.AUTH_PUBLIC_KEY_PATH) {
      throw new Error('PUBLIC_KEY_PATH environment variable is not defined.');
    } else {
      publicKey = fs.readFileSync(process.env.AUTH_PUBLIC_KEY_PATH, 'utf8');
    }
  }

  return {
    jwtConfig: new ConfigService({
      accessTokenExpireIn,
      refreshTokenExpireIn,
      accessTokenOptions: {
        algorithm: 'RS256',
        expiresIn: `${accessTokenExpireIn / 1000}s`,
        issuer: process.env.JWT_ISSUER,
      },
      refreshTokenOptions: {
        algorithm: 'RS256',
        expiresIn: `${refreshTokenExpireIn / 1000}s`,
        issuer: process.env.JWT_ISSUER,
      },
      privateKey: process.env.AUTH_PRIVATE_KEY || privateKey,
      publicKey: process.env.AUTH_PUBLIC_KEY || publicKey,
    } as IJwtConfiguration),
  };
};
