import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreatemappingDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsNumber()
  @IsNotEmpty()
  rate: number;
}
 
