import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Party } from './party.model';
import { UserCompany } from '../user-company/user-company.model'

import { PartyController } from './party.controller';
import { AuthModule } from '../../utils/auth/auth.module';
import { PartyService } from './party.service';
import { Account } from '../accounting/ledger/account.model';
@Module({
  imports: [SequelizeModule.forFeature([Party, UserCompany,Account]), AuthModule],
  providers: [PartyService],
  controllers: [PartyController],
  
})
export class PartyModule {}
