import { DataSource } from 'typeorm';
import 'dotenv/config';
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.db_host,
  port: parseInt(process.env.db_port, 10) || 5432,
  username: process.env.db_username,
  password: process.env.db_password,
  database: process.env.db,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  migrationsRun: true,
  logging: true,
});

export default dataSource;
