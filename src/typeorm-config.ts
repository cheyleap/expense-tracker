import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config({
  path: `${process.cwd()}/src/.env`,
});
console.log(process.env.DB_PASSWORD);
const config = new DataSource({
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: false,
  synchronize: false,
  entities: [__dirname + '/**/*.entity.{js,ts}'],
  migrations: [__dirname + '/database/**/*{.ts,.js}'],
  poolSize: 20,
  namingStrategy: new SnakeNamingStrategy(),
});

config.initialize();

export default config;
