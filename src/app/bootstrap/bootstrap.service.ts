import { Injectable, Logger } from '@nestjs/common';
import { logAround } from '../logger/decorator/log-around';
import { UserBootstrap } from '../users/user.bootstrap';

@Injectable()
export class BootstrapService {
  constructor(
    private logger: Logger,
    private userBootstrap: UserBootstrap,
  ) {
    this.logger.log('BootstrapService created');
    this.bootstrap();
  }

  @logAround()
  private bootstrap() {
    try {
      this.logger.log('Bootstrapping...');
      this.userBootstrap.bootstrap();
    } catch (error) {
      this.logger.error('bootstrapping failed', error);
      throw error;
    }
  }
}
