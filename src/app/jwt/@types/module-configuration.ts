import { SignOptions } from 'jsonwebtoken';

export interface IJwtConfiguration {
  accessTokenExpireIn: number;
  refreshTokenExpireIn: number;
  privateKey: string;
  publicKey: string;
  accessTokenOptions: SignOptions & { algorithm: 'none' };
  refreshTokenOptions: SignOptions & { algorithm: 'none' };
}
