import { Global, Module } from '@nestjs/common';
import { ICryptOptions } from './@types';
import { CryptoService } from './crypto.service';
import { CRYPTO_OPTIONS } from './constants';

@Global()
@Module({})
export class CryptoModule {
  static forRootAsync(asyncOptions: {
    inject: any[];
    useFactory: (...args: any[]) => Promise<ICryptOptions> | ICryptOptions;
  }) {
    const { useFactory } = asyncOptions;
    return {
      module: CryptoModule,
      providers: [
        {
          provide: CRYPTO_OPTIONS,
          useFactory: useFactory,
          inject: asyncOptions.inject,
        },
        CryptoService,
      ],
      exports: [CryptoService],
    };
  }
}
