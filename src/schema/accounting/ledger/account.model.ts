 export enum AccountType {
  CASH = 'CASH',
  BANK = 'BANK',
  PARTY = 'PARTY',
  SALES = 'SALES',
  PURCHASE = 'PURCHASE',
  EXPENSE = 'EXPENSE',
  SALES_RETURN = 'SALES_RETURN',
  PURCHASE_RETURN = 'PURCHASE_RETURN',
  TAX = 'TAX',
  CAPITAL = 'CAPITAL',
  DRAWINGS = 'DRAWINGS',
  ROUND_OFF = 'ROUND_OFF',
  LOAN = 'LOAN',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum openingBalanceType {
  DEBIT = 'Debit',
  CREDIT = 'Credit',
}
import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { VoucherDetail } from '../../accounting/voucher/voucher.details.model';
import { Party } from '../../party/party.model';
import { Company } from 'src/schema/company/company.model';

@Table({ tableName: 'account' })
export class Account extends Model<Account> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @Column
  name: string;

  @Column(DataType.ENUM(...Object.values(AccountType)))
  type: AccountType;

  @ForeignKey(() => Party)
  @Column({ allowNull: true })
  partyId?: number;

  @Column(DataType.DECIMAL(10, 2))
  declare openingBalance: number;  

  @Column({
    type: DataType.ENUM(...Object.values(openingBalanceType)),
  })
  declare openingBalanceType: openingBalanceType;

  @Column({ defaultValue: true })
  isActive: boolean;

  @HasMany(() => VoucherDetail)
  entries: VoucherDetail[];

 @BelongsTo(() => Party)
  party?: Party;
}
