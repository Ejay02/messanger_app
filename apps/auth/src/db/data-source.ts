import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity } from '../../../../libs/shared/src/entities/user.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'postgres',
  url: process.env.POSTGRES_URI,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [UserEntity],
  migrations: ['dist/apps/auth/apps/auth/src/db/migrations/*.js'],
  migrationsTableName: 'migrations',
};

export const dataSource = new DataSource(dataSourceOptions);
