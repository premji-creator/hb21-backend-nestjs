export enum DocumentType {
  SALES = 'SALES',
  PURCHASE = 'PURCHASE',
  SALES_RETURN = 'SALES_RETURN',
  PURCHASE_RETURN = 'PURCHASE_RETURN',
}

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';



import { Company } from '../company/company.model';
import { User } from '../user/user.model';
import { DocumentDetail } from './document-detail.model';
import { VoucherMaster } from '../accounting/voucher/voucher.model';

@Table({ tableName: 'document_master' })
export class DocumentMaster extends Model<
  DocumentMaster,
  {
    id?: number;
    companyId: number;
    userId: number;
    invoiceNo: string;
    invoiceDate: Date;
    totalAmount: number;
  }
> {
   @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Company)
  @Column
  declare companyId: number;

  @ForeignKey(() => User)
  @Column
  declare userId: number;

  @Column(DataType.ENUM(...Object.values(DocumentType)))
  type: DocumentType;

  @Column(DataType.STRING)
  declare documentNo: string;

  @Column(DataType.DATE)
  declare documentDate: Date;

  @Column(DataType.DECIMAL(10, 2))
  declare totalAmount: number;

  @Column(DataType.DECIMAL(10, 2))
  declare round_off: number;

  @Column(DataType.DECIMAL(10, 2))
  declare discount_amount: number;

  @Column(DataType.STRING)
  declare narration: string;

  @Column(DataType.STRING)
  declare status: string;    // (DRAFT / POSTED / CANCELLED)
  
  @ForeignKey(() => VoucherMaster)
  @Column
  voucherId: number;


  @HasMany(() => DocumentDetail)
  declare items: DocumentDetail[];

  @BelongsTo(() => Company)
  declare company: Company;

  @BelongsTo(() => User)
  declare user: User;
}
