import { ModuleMetadata } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';

export interface DbModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<DataSourceOptions> | DataSourceOptions;
  inject?: any[];
}
