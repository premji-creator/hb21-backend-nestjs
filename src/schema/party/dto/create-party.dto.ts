import { IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreatePartyDto {
  @IsNotEmpty()
  Partyname: string;

  @IsNotEmpty()
  partyType: string;  // e.g., 'Customer', 'Supplier'

  @IsOptional()
  code?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  gstNumber?: string;

  @IsOptional()
  tinNumber?: string;

  @IsOptional()
  panNumber?: string;

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
  debitLimit?: number;

  @IsOptional()
  creditLimit?: number;

  @IsOptional()
  creditDays?: number;

  @IsOptional()
  debitDays?: number;

  @IsOptional()
  openingBalance?: number;

  @IsOptional()
  openingBalanceType?: string;

  @IsOptional()
  companyId ?: number;

}







