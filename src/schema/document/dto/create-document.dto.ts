import { IsInt, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDocumentDetailDto } from './create-document-detail.dto';

export class CreateDocumentDto {
  @IsInt()
  companyId: number;

  @IsInt()
  userId: number;

  @IsDateString()
  invoiceDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentDetailDto)
  items: CreateDocumentDetailDto[];
}
