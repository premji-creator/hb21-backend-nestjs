import { IsNumber, IsString } from 'class-validator';

export class CreateItemPriceDto {
  @IsNumber()
  companyId: number;

  @IsString()
  itemName: string;

  @IsString()
  serviceType: string;

  @IsNumber()
  price: number;
}