import { DataSourceOptions } from 'typeorm';

export const postgresConfig = () => {
  if (!process.env.DB_HOST) {
    throw new Error('DB_HOST is not defined');
  }
  if (!process.env.DB_PORT) {
    throw new Error('DB_PORT is not defined');
  }
  if (!process.env.DB_USERNAME) {
    throw new Error('DB_USERNAME is not defined');
  }
  if (!process.env.DB_PASSWORD) {
    throw new Error('DB_PASSWORD is not defined');
  }
  if (!process.env.DB_NAME) {
    throw new Error('DB_NAME is not defined');
  }
  return {
    postgresConfig: {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
    } as DataSourceOptions,
  };
};
