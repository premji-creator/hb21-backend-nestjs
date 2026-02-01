import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Party } from './party.model';
import { UserCompany } from '../user-company/user-company.model'

import { PartyController } from './party.controller';
import { AuthModule } from '../../utils/auth/auth.module';
import { PartyService } from './party.service';
import { Account } from '../accounting/ledger/account.model';
import { AuditTrail } from '../accounting/audit/audit.trail.model';
import { AuditUtilityService } from 'src/utils/services/audit.utility.service';
import { VoucherMaster } from '../accounting/voucher/voucher.model';
import { VoucherDetail } from '../accounting/voucher/voucher.details.model';


@Module({
  imports: [SequelizeModule.forFeature([Party, UserCompany,Account,AuditTrail,VoucherMaster,VoucherDetail]), AuthModule],
  providers: [PartyService,AuditUtilityService],
  controllers: [PartyController],
  
})
export class PartyModule {}
