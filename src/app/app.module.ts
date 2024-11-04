import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbModule } from './db/db.module';
import * as path from 'path';
import {
  bootstrapConfig,
  cryptoConfig,
  jwtConfig,
  postgresConfig,
} from './config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { AuthModule } from './auth/auth.module';
import { RestModule } from './rest/rest.module';
import { UsersModule } from './users/user.module';
import { JwtModule } from './jwt/jwt.module';
import { HealthModule } from './health/health.module';
import { BootStrapModule } from './bootstrap/bootstrap.module';

const envFilePath = path.resolve(__dirname, '../../../.env');
@Module({
  imports: [
    DbModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('postgresConfig'),
    }),
    UsersModule,
    RestModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath,
      load: [postgresConfig, jwtConfig, bootstrapConfig, cryptoConfig],
    }),
    JwtModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('jwtConfig'),
    }),
    HealthModule,
    BootStrapModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
