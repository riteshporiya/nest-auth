import { Logger, Module } from '@nestjs/common';
import { CryptoModule } from '../crypt/crypto.module';
import { UsersModule } from '../users/user.module';
import { AuthModule } from '../auth/auth.module';
import { CryptoController } from './crypto.controller';
import { UsersController } from './users.controller';
import { AuthController } from './auth.controller';

@Module({
  imports: [AuthModule, UsersModule, CryptoModule],
  providers: [Logger],
  controllers: [AuthController, CryptoController, UsersController],
})
export class RestModule {}
