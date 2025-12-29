import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Item } from './item.model';
import { Service } from './service.model';

import { ItemPriceController } from './item-price.controller';
import { AuthModule } from '../../../utils/auth/auth.module';
import { ItemPriceService } from './item-price.service';
import { ItemPrice } from './item-price.model';
import { UserCompany } from 'src/schema/user-company/user-company.model';

@Module({
  imports: [SequelizeModule.forFeature([Item,Service,ItemPrice,UserCompany]), AuthModule],
  providers: [ItemPriceService],
  controllers: [ItemPriceController],
  
})
export class ItemPriceModule {}