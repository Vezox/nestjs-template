import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MyCustomLogger } from '../middlewares/logger/database';

const config = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '12345678',
  database: 'cms',
  migrationsTableName: 'migration',
  migrations: ['dist/migrations/*{.ts,.js}'],
  ssl: false,
  cli: {
    migrationsDir: 'src/migrations',
  },
  autoLoadEntities: true,
  synchronize: false,
  logging: true,
  logger: MyCustomLogger,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(
  config as unknown as DataSourceOptions,
);
