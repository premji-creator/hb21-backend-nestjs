import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Company } from './company.model';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Account,AccountType } from '../accounting/ledger/account.model';



@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company)
    private readonly companyModel: typeof Company,
  ) {}

  async create(data: CreateCompanyDto) {
    const company = await this.companyModel.create(data as any);

    await this.seedCompanyAccounts(company.id);

    return company;
  }
   
  findAll() {
    return this.companyModel.findAll();
  }

  findOne(id: number) {
    return this.companyModel.findByPk(id);
  }

  update(id: number, data: UpdateCompanyDto) {
    return this.companyModel.update(data as any, {
      where: { id },
    });
  }

  async remove(id: number) {
    const company = await this.companyModel.findByPk(id);
    if (!company) return null;
    await company.destroy();
    return { deleted: true };
  }

    async seedCompanyAccounts(companyId: number) {
          const accounts = [
            { name: 'CASH', type: AccountType.CASH },
            { name: 'BANK', type: AccountType.BANK },
            { name: 'PARTY', type: AccountType.PARTY },
            { name: 'SALES', type: AccountType.SALES },
            { name: 'CAPITAL', type: AccountType.CAPITAL },
            { name: 'ADJUSTMENT', type: AccountType.ADJUSTMENT },
            { name: 'PURCHASE', type: AccountType.PURCHASE },
            { name: 'EXPENSE', type: AccountType.EXPENSE },
            { name: 'SALES_RETURN', type: AccountType.SALES_RETURN },
            { name: 'PURCHASE_RETURN', type: AccountType.PURCHASE_RETURN },
            { name: 'TAX', type: AccountType.TAX },
            { name: 'DRAWINGS', type: AccountType.DRAWINGS },
            { name: 'LOAN', type: AccountType.LOAN },
            { name: 'ROUND_OFF', type: AccountType.ROUND_OFF }

          ];

          for (const acc of accounts) {
            await Account.findOrCreate({
              where: { companyId, type: acc.type },
              defaults: { companyId, ...acc } as any,
            });
          }
        }
}
