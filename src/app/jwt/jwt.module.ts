import { Global, Module } from '@nestjs/common';
import { IJwtConfiguration } from './@types';
import { ConfigService } from '@nestjs/config';
import { JWT_CONFIGURATION } from './constants';
import { JwtService } from './jwt.service';

@Global()
@Module({})
export class JwtModule {
  static forRootAsync(asyncOptions: {
    inject: any[];
    useFactory: (
      ...args: any[]
    ) =>
      | Promise<ConfigService<IJwtConfiguration>>
      | ConfigService<IJwtConfiguration>;
  }) {
    const { useFactory } = asyncOptions;
    return {
      module: JwtModule,
      providers: [
        {
          provide: JWT_CONFIGURATION,
          useFactory: useFactory,
          inject: asyncOptions.inject,
        },
        JwtService,
      ],
      exports: [JwtService],
    };
  }
}
