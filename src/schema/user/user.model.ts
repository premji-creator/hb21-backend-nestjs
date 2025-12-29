import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserCompany } from '../user-company/user-company.model';
@Table({ tableName: 'user' })
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;
  
   @HasMany(() => UserCompany)
  declare companies: UserCompany[];
}
