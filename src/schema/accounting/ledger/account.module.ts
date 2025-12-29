import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from './account.model';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AuthModule } from '../../../utils/auth/auth.module';
@Module({
  imports: [SequelizeModule.forFeature([Account]), AuthModule],
  providers: [AccountService],
  controllers: [AccountController],
  
})
export class AccountModule {}
