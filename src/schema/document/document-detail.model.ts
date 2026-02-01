import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,  
} from 'sequelize-typescript';
import { DocumentMaster } from './document-master.model';

@Table({ tableName: 'document_details' })
export class DocumentDetail extends Model<
  DocumentDetail,
  {
    id?: number;
    documentMasterId: number;
    productName: string;
    qty: number;
    rate: number;
    amount: number;
  }
> {
  @Column({ primaryKey: true, autoIncrement: true })
   @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => DocumentMaster)
  @Column
  declare documentMasterId: number;

  @Column(DataType.STRING)
  declare productName: string;

  @Column(DataType.INTEGER)
  declare qty: number;

  @Column(DataType.DECIMAL(10, 2))
  declare rate: number;

  @Column(DataType.DECIMAL(10, 2))
  declare amount: number;

  @BelongsTo(() => DocumentMaster)
  declare documentMaster: DocumentMaster;
}
