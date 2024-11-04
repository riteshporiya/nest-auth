import * as path from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, 'dist/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations/*.ts')], // Ensure this points to your migrations folder
  migrationsTableName: process.env.DB_MIGRATION_TABLE_NAME,
  logging: true,
  migrationsTransactionMode: 'each',
});
