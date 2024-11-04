import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from '@nestjs/terminus';
import { DbConnectionHealthIndicator } from '../db/db-connection-health.indicator';
import { Public } from '../auth/decorators';
import { logAround } from '../logger/decorator/log-around';

@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly dbHealthIndicator: DbConnectionHealthIndicator,
  ) {}

  @logAround()
  @Get()
  @Public()
  async check() {
    return this.healthService.check([
      async () => this.dbHealthIndicator.isHealthy(),
    ]);
  }
}
