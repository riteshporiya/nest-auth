import { Injectable } from '@nestjs/common';
import { BootStrap } from '../bootstrap/@types';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { CryptoService } from '../crypt/crypto.service';
import { logAround } from '../logger/decorator/log-around';

@Injectable()
export class UserBootstrap implements BootStrap {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly cryptoService: CryptoService,
  ) {}

  @logAround()
  public async bootstrap(): Promise<void> {
    const masterAdminEmail = this.configService.get<string>(
      'bootstrapConfig.masterAdmin.email',
    );
    const masterAdminPassword = this.configService.get<string>(
      'bootstrapConfig.masterAdmin.password',
    );
    const hashedPassword = await this.cryptoService.hash(masterAdminPassword);
    console.log(hashedPassword);
    this.userService.createOrUpdateMasterAdminUser(
      masterAdminEmail,
      hashedPassword,
    );
  }
}
