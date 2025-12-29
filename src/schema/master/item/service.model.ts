
import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { HasMany } from 'sequelize-typescript';
import { ItemPrice } from './item-price.model';
import {  } from 'sequelize-typescript';
import { Company } from '../../company/company.model';

@Table({ tableName: 'services' })
export class Service extends Model<Service> {

  @ForeignKey(() => Company)
  @Column
  declare companyId: number;

  @Column
  name: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @HasMany(() => ItemPrice)
  prices: ItemPrice[];

  @BelongsTo(() => Company)
  declare company: Company;
}