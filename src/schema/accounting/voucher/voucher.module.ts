import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VoucherMaster } from './voucher.model';
import { VoucherDetail } from './voucher.details.model';

import { VoucherService } from './voucher.service';
import { AuthModule } from '../../../utils/auth/auth.module';
import { VoucherController } from './voucher.controller';
import { Account } from '../ledger/account.model';

@Module({
  imports: [SequelizeModule.forFeature([VoucherMaster,VoucherDetail,Account]), AuthModule],
  providers: [VoucherService],
  controllers: [VoucherController],
  
})
export class VoucherModule {}
