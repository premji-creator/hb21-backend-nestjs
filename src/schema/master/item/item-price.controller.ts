import { Controller, Post, Body, Get, Query, UseGuards,Req } from '@nestjs/common';
import { ItemPriceService } from './item-price.service';
import { CreateItemPriceDto } from './dto/create-item-price.dto';
import { JwtAuthGuard } from 'src/utils/auth/jwt.auth.guard';

//import { BulkItemPriceDto } from './dto/bulk-item-price.dto';
import { CreateItemDto, CreatemappingDto} from './dto/create.item.dto';

@Controller('item-master')
export class ItemPriceController {
  constructor(private readonly service: ItemPriceService) {}

  @Post()
  create(@Body() dto: CreateItemPriceDto) {
    return {
      success: true,
      data: this.service.create(dto),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('itemlist')
  getItems(@Req() req: any) {
    console.log("Fetching req.........:",req.user);
    return this.service.findAllItems(req.user.sub);
  }

    @UseGuards(JwtAuthGuard)
  @Get('servicelist')
  getServices(@Req() req: any) {
    console.log("Fetching req.........:",req.user);
    return this.service.findAllServices(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('rates')
  getItemServiceRates(@Req() req: any) {
    console.log("Fetching req.........:",req.user);
    return this.service.findAllItemServiceRates(req.user.sub);
  }

  

//   @Post('bulk')
//   bulk(@Body() dto: BulkItemPriceDto) {
//     return {
//       success: true,
//       data: this.service.bulkCreate(dto),
//     };
//   }

  @Get()
  getAll(@Query('companyId') companyId: number) {
    return this.service.findAll(Number(companyId));
  }

  @UseGuards(JwtAuthGuard)
  @Post('items')
  itemsPost(@Body() dto: CreateItemDto,@Req() req: any) {
    console.log('Request body:', dto);
    console.log("Fetching req.........:",req.body);
    return this.service.createItem(dto,req.user.sub);
  }

    @UseGuards(JwtAuthGuard)
  @Post('services')
  servicesPost(@Body() dto: CreateItemDto,@Req() req: any) {
    console.log('Request body:', dto);
    console.log("Fetching req.........:",req.body);
    return this.service.createService(dto,req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('item-service-rate')
  itemServiceRate(@Body() dto: CreatemappingDto,@Req() req: any) {
    console.log('Request dto:', dto);
    console.log("Fetching body.........:",req.body);
    return this.service.createItemServiceRate(dto,req.user.sub);
  }

  

//   @Get('item')
//   getByItem(
//     @Query('companyId') companyId: number,
//     @Query('itemName') itemName: string,
//   ) {
//     return this.service.findByItem(Number(companyId), itemName);
//   }

//   @Get('price')
//   getPrice(
//     @Query('companyId') companyId: number,
//     @Query('itemName') itemName: string,
//     @Query('serviceType') serviceType: string,
//   ) {
//     return this.service.findPrice(
//       Number(companyId),
//       itemName,
//       serviceType,
//     );
 // }
}
