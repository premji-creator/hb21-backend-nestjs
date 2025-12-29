import { IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  gstNumber?: string;

  @IsOptional()
  tinNumber?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  pincode?: string;

  @IsOptional()
  contactNo1?: string;

  @IsOptional()
  contactNo2?: string;

  @IsOptional()
  planChoosed?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  invoiceType?: string;

  @IsOptional()
  rateType?: string;
}
