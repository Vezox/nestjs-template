import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MyCustomLogger } from 'src/middlewares/logger/database';

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
    entitiesDir: 'src/modules',
    migrationsDir: 'src/migrations',
  },
  autoLoadEntities: true,
  synchronize: true,
  logging: true,
  logger: MyCustomLogger,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(
  config as unknown as DataSourceOptions,
);
