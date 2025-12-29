import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
dotenv.config();

export const databaseConfig: SequelizeModuleOptions = {
  dialect: process.env.DB_DIALECT as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  autoLoadModels: true,
  synchronize: true, // Auto create tables - disable in production
};