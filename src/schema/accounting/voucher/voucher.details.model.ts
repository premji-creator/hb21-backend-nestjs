// src/accounting/models/voucher-detail.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { VoucherMaster } from './voucher.model';
import { Account } from '../../accounting/ledger/account.model';

@Table({ tableName: 'voucher_detail' })
export class VoucherDetail extends Model<VoucherDetail> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => VoucherMaster)
  @Column
  voucherId: number;

  @ForeignKey(() => Account)
  @Column
  accountId: number;

  @Column(DataType.DECIMAL(10, 2))
  debit: number;

  @Column(DataType.DECIMAL(10, 2))
  credit: number;

  @BelongsTo(() => VoucherMaster)
  voucher: VoucherMaster;

  @BelongsTo(() => Account)
  account: Account;
}
