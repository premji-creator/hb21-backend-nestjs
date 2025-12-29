import { IsInt, IsEnum } from 'class-validator';
import { CompanyRole } from '../user-company.model';

export class CreateUserCompanyDto {
  @IsInt()
  userId: number;

  @IsInt()
  companyId: number;

  @IsEnum(CompanyRole)
  role: CompanyRole;
}
