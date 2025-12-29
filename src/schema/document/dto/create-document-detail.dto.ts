import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDocumentDetailDto {
  @IsNotEmpty()
  productName: string;

  @IsInt()
  qty: number;

  @IsNumber()
  rate: number;

  @IsNumber()
  amount: number;
}
