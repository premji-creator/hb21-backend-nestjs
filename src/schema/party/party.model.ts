import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Company } from '../company/company.model';
export enum PartyTypes {
  CUSTOMER = 'Customer',
  VENDOR = 'Vendor',
  BOTH = 'Both',
}

@Table({ tableName: 'parties' })
export class Party extends Model<Party> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

    @Column({
    type: DataType.ENUM(...Object.values(PartyTypes)),
  })
  partyType: PartyTypes;

  @Column(DataType.STRING)
  declare Partyname: string;

  @Column(DataType.STRING)
  declare email: string;

  @Column(DataType.STRING)
  declare gstNumber: string;

  @Column(DataType.STRING)
  declare tinNumber: string;

  @Column(DataType.STRING)
  declare panNumber: string;

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

  @Column(DataType.DECIMAL(10, 2))
  declare debitLimit: number;

  @Column(DataType.DECIMAL(10, 2))
  declare creditLimit: number;

  @Column(DataType.DECIMAL(10, 2))
  declare creditDays: number;

  @Column(DataType.DECIMAL(10, 2))
  declare debitDays: number;

 
}
