import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ItemPrice } from './item-price.model';
import { CreateItemPriceDto } from './dto/create-item-price.dto';
import { Item } from './item.model';
import { Service } from './service.model';
import { UserCompany } from 'src/schema/user-company/user-company.model';
import { CreateItemDto , CreatemappingDto} from './dto/create.item.dto';
//import { BulkItemPriceDto } from './dto/bulk-item-price.dto';

@Injectable()
export class ItemPriceService {
  constructor(
    @InjectModel(ItemPrice)
    private readonly priceModel: typeof ItemPrice,
    @InjectModel(Item)
    private readonly ItemModel: typeof Item,
    @InjectModel(UserCompany)
    private readonly userCompanyModel: typeof UserCompany,
    @InjectModel(Service)
    private readonly ServiceModel: typeof Service,
  ) {}

  create(dto: CreateItemPriceDto) {
    return this.priceModel.upsert(dto as any);
  }

//   async bulkCreate(dto: BulkItemPriceDto) {
//     return this.priceModel.bulkCreate(
//       dto.prices.map((p) => ({
//         companyId: dto.companyId,
//         ...p,
//       })),
//       { updateOnDuplicate: ['price'] },
//     );
//   }

//   findByItem(companyId: number, itemName: string) {
//     return this.priceModel.findAll({
//       where: { companyId, itemName },
//     });
//   }

//   findPrice(
//     companyId: number,
//     itemName: string,
//     serviceType: string,
//   ) {
//     return this.priceModel.findOne({
//       where: { companyId, itemName, serviceType },
//     });
//   }

  findAll(companyId: number) {
    return this.priceModel.findAll({ where: { companyId } });
  }
  async findAllItems(userId: number) {
    const userCompany = await this.userCompanyModel.findOne({
      where: { userId },
    });
    console.log("User Company Details:",userCompany);
    return this.ItemModel.findAll({
      where: { companyId: userCompany?.companyId },
      // attributes: ['itemName'],
      // group: ['itemName'],
    });
  }


  async findAllServices(userId: number) {
     const userCompany = await this.userCompanyModel.findOne({
      where: { userId },
    });
    return this.ServiceModel.findAll({
      where: { companyId: userCompany?.companyId },
      // attributes: ['itemName'],
      // group: ['itemName'],
    });
  }

  async findAllItemServiceRates(userId: number) {
      const userCompany = await this.userCompanyModel.findOne({
        where: { userId },
      });
      return this.priceModel.findAll({
        where: { companyId: userCompany?.companyId },
        include: [Item,Service],
      });
    }

  async createItem(data: CreateItemDto,userId: number) {
    const userCompany = await this.userCompanyModel.findOne({
      where: { userId },
    });
   
    return this.ItemModel.create({
      companyId: userCompany?.companyId,
      name: data.name     
    } as any);
  }

    async createService(data: CreateItemDto,userId: number) {
    const userCompany = await this.userCompanyModel.findOne({
      where: { userId },
    });
    
    return this.ServiceModel.create({
      companyId: userCompany?.companyId,
      name: data.name     
    } as any);
  }

  async createItemServiceRate(data: CreatemappingDto,userId: number) {
    const userCompany = await this.userCompanyModel.findOne({
      where: { userId },
    });
    console.log("User Company Details:",userCompany);
   const existing = await this.priceModel.findOne({
      where: { 
        companyId: userCompany?.companyId,
        itemId: data.itemId,
        serviceId: data.serviceId
       },
    });
    if (existing) {
      existing.price = data.rate;
      await existing.save();
      return {
                message: 'Existing Rate updated successfully',
                itemId: data.itemId,
                serviceId: data.serviceId
            };
    }

    return this.priceModel.create({
      companyId: userCompany?.companyId,
      itemId: data.itemId,
      serviceId: data.serviceId,
      price: data.rate     
    } as any);
  }

 
}
