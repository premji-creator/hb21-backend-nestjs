import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  Index,
  BelongsTo,
} from 'sequelize-typescript';
import { Company } from '../../company/company.model';
import { Item } from './item.model';
import { Service } from './service.model';
@Table({
  tableName: 'item_price_master',
  indexes: [
    {
      unique: true,
      fields: ['companyId', 'itemId', 'serviceId'],
    },
  ],
})
export class ItemPrice extends Model<ItemPrice> {
  @ForeignKey(() => Company)
  @Column
  companyId: number;


  @ForeignKey(() => Item)
  @Column
  itemId: number;

   @ForeignKey(() => Service)
  @Column
  serviceId: number;

 

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;
  
  @BelongsTo(() => Item)
  item: Item;

  @BelongsTo(() => Service)
  service: Service;

    @BelongsTo(() => Company)
  company: Company;

}