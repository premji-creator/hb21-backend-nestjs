// src/admin/dto/drop-tables.dto.ts
import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class DropTablesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tables: string[];
}
