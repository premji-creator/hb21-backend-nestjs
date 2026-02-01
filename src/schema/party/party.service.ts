import { Injectable } from '@nestjs/common';
import { InjectModel,InjectConnection } from '@nestjs/sequelize';
import { Party } from './party.model';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { UserCompany } from '../user-company/user-company.model';
import { AuditTrail } from '../accounting/audit/audit.trail.model';
import { Sequelize } from 'sequelize-typescript';
import { Account, AccountType } from '../accounting/ledger/account.model';

import { getChangedFields } from 'src/utils/middleware/isupdate';
import { AuditUtilityService } from 'src/utils/services/audit.utility.service';
import { VoucherMaster } from '../accounting/voucher/voucher.model';
import { VoucherDetail } from '../accounting/voucher/voucher.details.model';
import { Op } from 'sequelize'


@Injectable()
export class PartyService {
  constructor(
    @InjectModel(Party)
    private readonly PartyModel: typeof Party,

        @InjectModel(UserCompany)
        private readonly userCompanyModel: typeof UserCompany,


           @InjectModel(VoucherMaster)
        private readonly VoucherMasterModel: typeof VoucherMaster,

             @InjectModel(VoucherDetail)
        private readonly VoucherDetailModel: typeof VoucherDetail,
        
        @InjectModel(Account)
        private readonly accountModel: typeof Account,
        @InjectConnection() private sequelize: Sequelize,
        @InjectModel(AuditTrail)
        private readonly auditTrailModel: typeof AuditTrail,
        private auditUtil: AuditUtilityService,
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

        
        await this.sequelize.transaction(async (t) => {
         const createdParty = await this.PartyModel.create(data as any, { transaction: t });

          const createdacc= await this.accountModel.create({
            companyId: companyId,
            name: createdParty.Partyname,
            type: AccountType.PARTY,
            partyId: createdParty.id,
            openingBalance: data.openingBalance || 0,
            openingBalanceType: data.openingBalanceType || 'DEBIT',
          } as any, { transaction: t });

              if(createdacc.openingBalance > 0 && createdParty)
                    {

                      const fySuffix = "25-26"; 

                      // 2. Find the next sequence number for this specific FY
                      const lastVoucher = await this.VoucherMasterModel.findOne({
                        where: { 
                          companyId, 
                          voucherNo: { [Op.like]: `OB/${fySuffix}/%` } 
                        },
                        order: [['id', 'DESC']],
                        transaction: t
                      });

                      let sequence = 1;
                      if (lastVoucher) {
                        const parts = lastVoucher.voucherNo.split('/');
                        sequence = parseInt(parts[2]) + 1;
                      }

                      // 3. Format the Voucher Number (with padding, e.g., 001)
                      const formattedVNo = `OB/${fySuffix}/${sequence.toString().padStart(3, '0')}`;
                      
                const mapToCreate = {
                  companyId : companyId,
                  type : 'OPENING',                  
                voucherNo: formattedVNo,
                voucherDate: new Date(), // Today's date
                refNo: `PARTY-${createdParty.id}`,
                partyId: createdParty.id,
                totalAmount: createdacc.openingBalance,
                narration: `Opening balance for ${createdacc.name}`

                };

              const vMaster =  await this.VoucherMasterModel.create(mapToCreate as any , {transaction : t})


                const adjustmentAccount = await this.accountModel.findOne({
                    where: { companyId, type: 'ADJUSTMENT' },
                    transaction: t
                  });

                  await this.VoucherDetailModel.bulkCreate([
                    {
                      voucherId: vMaster.id,
                      accountId: createdacc.id, // The Customer Account
                      debit: createdacc.openingBalance,
                      credit: 0
                      
                    },
                    {
                      voucherId: vMaster.id,
                      accountId: adjustmentAccount?.id, // The Offset Account
                      debit: 0,
                      credit: createdacc.openingBalance
                      
                    }
                  ] as any, { transaction: t });

             
                  

              }

        });
     
       

        return { message : 'Customer added successfully', data: userCompany };
    }
    catch (err) {
      console.error('Error adding customer:', err);
        return { message : 'Error adding customer', error: err };
    }
  }
async updateParty(data: UpdatePartyDto,userId: number) {
    try{
        const userCompany =  await this.userCompanyModel.findOne({
          where: { userId },
        });
        if (!userCompany) {
          throw new Error('User company not found');
        }
        const companyId = userCompany.companyId;

        let updatedParty;
        await this.sequelize.transaction(async (t) => {
          const existingParty = await this.PartyModel.findOne({
            where: { id: data.id, companyId },
            transaction: t,
          });

          if (!existingParty) {
            throw new Error('Party not found');
          }

          await this.auditUtil.updateWithAudit<Party>(
            existingParty,
            data,
            ['Partyname', 'partyType', 'email', 'gstNumber', 'tinNumber', 'panNumber', 'address', 'city', 'pincode', 'contactNo1', 'contactNo2', 'debitLimit', 'creditLimit', 'creditDays', 'debitDays'],
            { companyId, userId, modelName: 'Party' },
            t,
          );

         updatedParty = await this.PartyModel.findOne({
            where: { id: data.id, companyId },
            transaction: t,
          });

         const existingAccount = await this.accountModel.findOne({
            where: { partyId: data.id, companyId },
            transaction: t,
          });

          if (existingAccount) {
            await this.auditUtil.updateWithAudit<Account>(
              existingAccount,
              data,
              ['openingBalance', 'openingBalanceType', 'name', 'isActive'],
              { companyId, userId, modelName: 'Account' },
              t,
            );
          }
          else {
            throw new Error('Associated account not found for the party');
          }
          await this.accountModel.update({
            openingBalance: existingAccount?.openingBalance,
            openingBalanceType: existingAccount?.openingBalanceType,
            name: updatedParty?.Partyname,
          } as any, {
            where: { partyId: data.id, companyId },
            transaction: t,
          });
        });
        return { message : 'Customer updated successfully', data: updatedParty };
    }
    catch (err) {
      console.error('Error updating customer:', err);
        return { message : 'Error updating customer', error: err };
    }
  }



  async findAll(userId: number) {
    
       const userCompany = await this.userCompanyModel.findOne({
      where: { userId },
    });
    return this.PartyModel.findAll({
     where: { companyId : userCompany?.companyId },
     include: ['account'],
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

  async returnbody(data: any,userId: number ) {
    return {message : 'Success', data: data, userId: userId};
  }
}
