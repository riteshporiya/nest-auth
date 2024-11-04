import { Logger, Module } from '@nestjs/common';
import { BootstrapService } from './bootstrap.service';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [UsersModule],
  providers: [BootstrapService, Logger],
})
export class BootStrapModule {}
