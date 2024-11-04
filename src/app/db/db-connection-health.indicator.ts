import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { DATA_SOURCE } from './constants';
import { DataSource } from 'typeorm';

@Injectable()
export class DbConnectionHealthIndicator extends HealthIndicator {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const isConnected = this.dataSource.isInitialized;
    const result = this.getStatus('db', isConnected, {
      isConnected,
    });

    if (isConnected) {
      return result;
    }
  }
}
