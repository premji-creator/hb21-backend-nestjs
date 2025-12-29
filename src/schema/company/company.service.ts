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
            { name: 'Cash', type: AccountType.CASH },
            { name: 'Sales', type: AccountType.SALES },
            { name: 'Purchase', type: AccountType.PURCHASE },
            { name: 'Capital', type: AccountType.CAPITAL },
            { name: 'Opening Balance', type: AccountType.ADJUSTMENT },
          ];

          for (const acc of accounts) {
            await Account.findOrCreate({
              where: { companyId, type: acc.type },
              defaults: { companyId, ...acc } as any,
            });
          }
        }
}
