import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './database.config';

import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { AuthModule } from 'src/utils/auth/auth.module';


@Module({
  imports: [SequelizeModule.forRoot(databaseConfig),AuthModule],
  providers: [DatabaseService],
  controllers: [DatabaseController],
})
export class DatabaseModule {}