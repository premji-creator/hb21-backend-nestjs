
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { VoucherMaster,VoucherType } from './voucher.model';
import { VoucherDetail } from './voucher.details.model';
import { Account } from '../ledger/account.model';
import { Sequelize } from 'sequelize-typescript';



@Injectable()
export class VoucherService {
  constructor(
     @InjectModel(VoucherMaster) private voucherMasterModel: typeof VoucherMaster,
     @InjectModel(VoucherDetail) private voucherDetailModel: typeof VoucherDetail,
     @InjectModel(Account) private accountModel: typeof Account,
     @InjectConnection() private sequelize: Sequelize,
  ) {}




 
  async purchase(companyId: number, partyAccId: number, amount: number) {
    const purchaseAcc = await this.accountModel.findOne({ where: { companyId, type: 'PURCHASE' }});
    await this.createVoucher2(companyId, VoucherType.PURCHASE, new Date(), 'ref_no',    [
      { accountId: partyAccId, debit: amount },
      { accountId: purchaseAcc!.id, credit: amount },
    ], partyAccId , amount, 'Purchase Voucher');
  }


 async sale( companyId: number, partyAccId: number, amount: number, cashReceived: number) {
    const cashAcc = await this.accountModel.findOne({ where: { companyId, type: 'CASH' }});
    const salesAcc = await this.accountModel.findOne({ where: { companyId, type: 'SALES' }});
    
    // Sale entry
    await this.createVoucher2(companyId, VoucherType.SALES, new Date(), 'ref_no', [
      { accountId: partyAccId, debit: amount },
      { accountId: salesAcc!.id, credit: amount },
    ], partyAccId , amount, 'Sale Voucher');

    // Receipt entry
    if (cashReceived > 0) {
      await this.createVoucher2(companyId, VoucherType.RECEIPT, new Date(), 'ref_no', [
        { accountId: cashAcc!.id, debit: cashReceived },
        { accountId: partyAccId, credit: cashReceived },
      ], partyAccId , cashReceived, 'Cash Receipt');
    }
  }

  async payment(companyId: number, partyAccId: number, amount: number) {
    const cashAcc = await this.accountModel.findOne({ where: { companyId, type: 'CASH' }});
    
    await this.createVoucher2(companyId, VoucherType.PAYMENT, new Date(), 'ref_no', [
        { accountId: partyAccId, debit: amount },
        { accountId: cashAcc!.id, credit: amount },
      ], partyAccId , amount, 'Payment Voucher');
  }
    async salesReturn(companyId: number, partyAccId: number, amount: number) {
    const salesReturnAcc = await this.accountModel.findOne({
        where: { companyId, type: 'SALES_RETURN' },
        });
    await this.createVoucher2(companyId, VoucherType.SALES_RETURN, new Date(), 'ref_no', [
        { accountId: salesReturnAcc!.id, debit: amount },
        { accountId: partyAccId, credit: amount },
      ], partyAccId , amount, 'Sales Return Voucher');
  }
    async purchaseReturn(companyId: number, partyAccId: number, amount: number) {
    const purchaseReturnAcc = await this.accountModel.findOne({
        where: { companyId, type: 'PURCHASE_RETURN' },
        });
    await this.createVoucher2(companyId, VoucherType.PURCHASE_RETURN, new Date(), 'ref_no', [
        { accountId: partyAccId, debit: amount },
        { accountId: purchaseReturnAcc!.id, credit: amount },
      ], partyAccId , amount, 'Purchase Return Voucher');
  }


  async createVoucher2(
    companyId: number,
    type: VoucherType,
    voucherDate = new Date(),
    refNo: string,    
    entries: { accountId: number; debit?: number; credit?: number }[],
    partyId?: number,
    totalAmount?: number,
    narration?: string,
  ) {

         const transaction = await this.sequelize.transaction();
         try
         {         
        
      const VoucherMasterx = await this.voucherMasterModel.create({ companyId, type, refNo, voucherDate, partyId, totalAmount, narration } as any,{ transaction });
      let totalDr = 0;
        let totalCr = 0;
        for (const e of entries) {  
            await this.voucherDetailModel.create({
              voucherId: VoucherMasterx.id,
              accountId: e.accountId,
              debit: e.debit || 0,
              credit: e.credit || 0,
            } as any, { transaction });

                  if (totalDr !== totalCr) {
                      throw new BadRequestException('Debit and Credit not matching');
                   }
              return VoucherMasterx;
        }   

        await transaction.commit();
    }
    catch (error)
    {
        await transaction.rollback();
        throw error;
    }
  }








}
