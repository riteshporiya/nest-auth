import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserBootstrap } from './user.bootstrap';
import { userProvider } from './providers/user.provider';
import { UserService } from './user.service';
import { CryptoModule } from '../crypt/crypto.module';

@Module({
  imports: [
    CryptoModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('cryptoConfig'),
    }),
  ],
  providers: [UserService, ...userProvider, UserBootstrap],
  exports: [UserService, UserBootstrap],
})
export class UsersModule {}
