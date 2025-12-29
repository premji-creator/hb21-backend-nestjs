 export enum VoucherType {
  SALES = 'SALES',
  PURCHASE = 'PURCHASE',
  RECEIPT = 'RECEIPT',
  PAYMENT = 'PAYMENT',
  CONTRA = 'CONTRA',
  JOURNAL = 'JOURNAL',
  SALES_RETURN = "SALES_RETURN",
  PURCHASE_RETURN = "PURCHASE_RETURN",
}
import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript';

import { VoucherDetail } from './voucher.details.model';
import { Party } from '../../party/party.model';
import { Company } from 'src/schema/company/company.model';

@Table({ tableName: 'voucher_master' })
export class VoucherMaster extends Model<VoucherMaster> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @Column(DataType.ENUM(...Object.values(VoucherType)))
  type: VoucherType;

  @Column
  voucherNo: string;

  @Column(DataType.DATE)
  voucherDate: Date;

   @Column
  refNo: string;
  

  @ForeignKey(() => Party)
  @Column({ allowNull: true })
  partyId?: number;

  @Column(DataType.DECIMAL(10, 2))
  totalAmount: number;

  @Column
  narration: string;

  @HasMany(() => VoucherDetail)
  entries: VoucherDetail[];
}
