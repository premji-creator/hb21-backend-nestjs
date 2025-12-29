import { Injectable } from '@nestjs/common';
import { InjectModel,InjectConnection } from '@nestjs/sequelize';
import { Party } from './party.model';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { UserCompany } from '../user-company/user-company.model';
import { Sequelize } from 'sequelize-typescript';
import { Account, AccountType } from '../accounting/ledger/account.model';

@Injectable()
export class PartyService {
  constructor(
    @InjectModel(Party)
    private readonly PartyModel: typeof Party,

        @InjectModel(UserCompany)
        private readonly userCompanyModel: typeof UserCompany,
        @InjectModel(Account)
        private readonly accountModel: typeof Account,
        @InjectConnection() private sequelize: Sequelize,
  ) {}



  async addnewParty(data: CreatePartyDto,userId: number) {
    try{
        const userCompany =  await this.userCompanyModel.findOne({
          where: { userId },
        });
        if (!userCompany) {
          throw new Error('User company not found');
        }
        const companyId = userCompany.companyId;
        data.companyId = companyId;

        let createdParty;
        await this.sequelize.transaction(async (t) => {
          createdParty = await this.PartyModel.create(data as any, { transaction: t });

          await this.accountModel.create({
            companyId: companyId,
            name: createdParty.Partyname,
            type: AccountType.PARTY,
            partyId: createdParty.id,
            openingBalance: data.openingBalance || 0,
            openingBalanceType: data.openingBalanceType || 'DEBIT',
          } as any, { transaction: t });
        });
        return { message : 'Customer added successfully', data: createdParty };
    }
    catch (err) {
      console.error('Error adding customer:', err);
        return { message : 'Error adding customer', error: err };
    }
  }

  async findAll(userId: number) {
    
       const userCompany = await this.userCompanyModel.findOne({
      where: { userId },
    });
    return this.PartyModel.findAll({
     where: { companyId : userCompany?.companyId },
  });
  }

  findOne(id: number) {
    return this.PartyModel.findByPk(id);
  }

  update(id: number, data: UpdatePartyDto) {
    return this.PartyModel.update(data as any, {
      where: { id },
    });
  }

  async remove(id: number) {
    const company = await this.PartyModel.findByPk(id);
    if (!company) return null;
    await company.destroy();
    return { deleted: true };
  }
}
