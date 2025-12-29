import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'companies' })
export class Company extends Model<Company> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare gstNumber: string;

  @Column(DataType.STRING)
  declare tinNumber: string;

  @Column(DataType.STRING)
  declare address: string;

  @Column(DataType.STRING)
  declare city: string;

  @Column(DataType.STRING)
  declare pincode: string;

  @Column(DataType.STRING)
  declare contactNo1: string;

  @Column(DataType.STRING)
  declare contactNo2: string;

  @Column(DataType.STRING)
  declare planChoosed: string;

  @Column(DataType.DATE)
  declare expiryDate: Date;

  @Column(DataType.STRING)
  declare invoiceType: string;

  @Column(DataType.STRING)
  declare rateType: string;
}
