import {
  Table,
  Column,
  Model
} from 'sequelize-typescript';
import { HasMany } from 'sequelize-typescript';
import { ItemPrice } from './item-price.model';

@Table({ tableName: 'items' })
export class Item extends Model<Item> {

  @Column
  companyId: number;

  @Column
  name: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @HasMany(() => ItemPrice)
  prices: ItemPrice[];
}
