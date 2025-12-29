

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Company } from '../company/company.model';

export enum CompanyRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  COUNTER = 'COUNTER',
}

@Table({ tableName: 'user_company' })
export class UserCompany extends Model<UserCompany> {

  @ForeignKey(() => User)
  @Column
  declare userId: number;

  @ForeignKey(() => Company)
  @Column
  declare companyId: number;

  // @ForeignKey(() => Branch)     // create Branch model later 
  // @Column
  // declare branchId: number;

  @Column({
    type: DataType.ENUM(...Object.values(CompanyRole)),
    allowNull: false,
  })
  declare role: CompanyRole;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Company)
  declare company: Company;
}
