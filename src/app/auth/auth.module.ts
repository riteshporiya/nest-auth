import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '../jwt/jwt.module';
import { UsersModule } from '../users/user.module';
import { CryptoModule } from '../crypt/crypto.module';
import { ConfigService } from '@nestjs/config';
import { RolesGuard } from './guards';

@Module({
  imports: [
    JwtModule,
    UsersModule,
    CryptoModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('cryptoConfig'),
    }),
  ],
  providers: [AuthService, Logger, RolesGuard],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
