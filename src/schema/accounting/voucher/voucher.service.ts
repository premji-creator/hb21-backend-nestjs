
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { VoucherMaster,VoucherType } from './voucher.model';
import { VoucherDetail } from './voucher.details.model';
import { Account, AccountType } from '../ledger/account.model';
import { Sequelize } from 'sequelize-typescript';
import { UserCompany, CompanyRole } from '../../user-company/user-company.model';
import { Party } from 'src/schema/party/party.model';


@Injectable()
export class VoucherService {
  constructor(
     @InjectModel(VoucherMaster) private voucherMasterModel: typeof VoucherMaster,
     @InjectModel(VoucherDetail) private voucherDetailModel: typeof VoucherDetail,
         @InjectModel(UserCompany)
            private readonly userCompanyModel: typeof UserCompany,

     @InjectModel(Account) private accountModel: typeof Account,
     @InjectConnection() private sequelize: Sequelize,
  ) {}




  async findAllpayments(userId: number) {
    const userCompany =  await this.userCompanyModel.findOne({
          where: { userId },
        });
        if (!userCompany) {
          throw new Error('User company not found');
        }
        const companyId = userCompany.companyId;

    return this.voucherMasterModel.findAll({
      where: { companyId, type: VoucherType.PAYMENT },
      include: [VoucherDetail,Party],
    });
  }

  async findAllreceipts(userId: number) {
    const userCompany =  await this.userCompanyModel.findOne({
          where: { userId },
        });
        if (!userCompany) {
          throw new Error('User company not found');
        }
        const companyId = userCompany.companyId;

    return this.voucherMasterModel.findAll({
      where: { companyId, type: VoucherType.RECEIPT },
      include: [VoucherDetail,Party],
    });
  }

   



  async generateDocumentNumber(companyId: number, type: string): Promise<string> {
  
    console.log('Generating document number for type:', type,companyId);
  const lastDocument = await this.voucherMasterModel.findOne({
     where: { companyId, type },
    order: [['id', 'DESC']],    
  }); 

  let nextNumber = 1;

  if (lastDocument && lastDocument.voucherNo) {
    // 2. Extract the number part using Split
    // If 'SALE-21', split('-') gives ['SALE', '21']
    const parts = lastDocument.voucherNo.split('-');
    const lastNumber = parseInt(parts[parts.length - 1], 10);
    
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }
else{
  return `${type}-${1}`;
}
  // 3. Return formatted string: e.g., SALE-22
  console.log('Next document number:', `${type}-${nextNumber}`);
  return `${type}-${nextNumber}`;
}


async receipt(dto: any,userId:number): Promise<{ message: string;  dato:any, userId:number}> {
    try{
      
      console.log('Inside VoucherService. user id',userId);
console.table( dto);
    // return { message: 'Error adding document', dato : dto as any , userId : userId};
        const userCompany =  await this.userCompanyModel.findOne({
          where: { userId },
        });
        if (!userCompany) {
          throw new Error('User company not found');
        }
        const companyId = userCompany.companyId;

         console.log('Inside VoucherService. company id', companyId);

       // dto.companyId = companyId;

    const formattedReceipt = {
  companyId: companyId,
  userId: userId,
  partyId : dto[0].partyId,
     voucherDate:dto[0].voucherDate,
           totalAmount: dto[0].totalAmount,
      mode: dto[0].mode,
      refNo: dto[0].refNo,
      narration: dto[0].narration,
      type: VoucherType.RECEIPT, 
};

    const formattedReceipts = {
  companyId: companyId,
  userId: userId,
  partyId : dto[0].partyId,
     voucherDate:dto[0].voucherDate,
      partyAccountId: await this.getPartyAccountId(companyId,dto[0].partyId),
      paymentAccountId: await this.getPaymentAccountId(companyId,dto[0].mode),      
      totalAmount: dto[0].totalAmount,
      mode: dto[0].mode,
      refNo: dto[0].refNo,
      narration: dto[0].narration,
      type: VoucherType.RECEIPT, 
};
console.table(formattedReceipts);

const newDocNo = await this.generateDocumentNumber(companyId,formattedReceipt.type);  
const voucherMasters  = await this.voucherMasterModel.create({...formattedReceipt,voucherNo:newDocNo} as any);
  console.log('Created Voucher Master:', voucherMasters.id);
  const voucherDetails = await Promise.all([formattedReceipts].map(async (receipt) => { 
  return [
    {
      voucherId: voucherMasters.id,
      accountId: receipt.partyAccountId,
      debit: 0,
      credit: receipt.totalAmount,
      narration: receipt.narration,
      companyId: receipt.companyId,
    },
    {
      voucherId: voucherMasters.id,
      accountId: receipt.paymentAccountId,
      debit: receipt.totalAmount,
      credit: 0,
      narration: receipt.narration,
      companyId: receipt.companyId,
    },
  ];
})).then((arrays) => arrays.flat());

await this.voucherDetailModel.bulkCreate(voucherDetails as any[]);

console.table(voucherDetails);






     return { message: 'Receipt created successfully', dato : dto as any , userId : userId};
    // const cashAcc = await this.accountModel.findOne({ where: { companyId, type: 'CASH' }});
}catch (error)
  {
      return { message: 'Error adding document', dato : dto as any , userId : userId};
  }
  }



    

 async payment(dto: any,userId:number): Promise<{ message: string;  dato:any, userId:number}> {
    try{

      console.log('Inside VoucherService. user id',userId);
console.table( dto);

   // return { message: 'Error adding document', dato : dto as any , userId : userId};

       const userCompany =  await this.userCompanyModel.findOne({
          where: { userId },
        });
        if (!userCompany) {
          throw new Error('User company not found');
        }
        const companyId = userCompany.companyId;

         console.log('Inside VoucherService. company id', companyId);

       // dto.companyId = companyId;

    const formattedPayment = {
  companyId: companyId,
  userId: userId,
  partyId : dto[0].partyId,
     voucherDate:dto[0].voucherDate,
           totalAmount: dto[0].totalAmount,
      mode: dto[0].mode,
      refNo: dto[0].refNo,
      narration: dto[0].narration,
      type: VoucherType.PAYMENT, 
};

    const formattedPayments = {
  companyId: companyId,
  userId: userId,
  partyId : dto[0].partyId,
     voucherDate:dto[0].voucherDate,
      partyAccountId: await this.getPartyAccountId(companyId,dto[0].partyId),
      paymentAccountId: await this.getPaymentAccountId(companyId,dto[0].mode),      
      totalAmount: dto[0].totalAmount,
      mode: dto[0].mode,
      refNo: dto[0].refNo,
      narration: dto[0].narration,
      type: VoucherType.PAYMENT, 
};
console.table(formattedPayments);

const newDocNo = await this.generateDocumentNumber(companyId,formattedPayment.type);

const voucherMasters  = await this.voucherMasterModel.create({...formattedPayment,voucherNo:newDocNo} as any);


 console.log('Created Voucher Master:', voucherMasters.id);





  const voucherDetails = await Promise.all([formattedPayments].map(async (payment) => {
  return [
    {
      voucherId: voucherMasters.id,
      accountId: payment.partyAccountId,
      debit: payment.totalAmount,
      credit: 0,
      narration: payment.narration,
      companyId: payment.companyId,
    },
    {
      voucherId: voucherMasters.id,
      accountId: payment.paymentAccountId,
      debit: 0,
      credit: payment.totalAmount,
      narration: payment.narration,
      companyId: payment.companyId,
    },
  ];
})).then((arrays) => arrays.flat());

await this.voucherDetailModel.bulkCreate(voucherDetails as any[]);

console.table(voucherDetails);


     return { message: 'Error adding document', dato : dto as any , userId : userId};

    // const cashAcc = await this.accountModel.findOne({ where: { companyId, type: 'CASH' }});
    
    // await this.createVoucher2(companyId, VoucherType.PAYMENT, new Date(), 'ref_no', [
    //     { accountId: data.partyAccId, debit: data.amount },
    //     { accountId: cashAcc!.id, credit: data.amount },
    //   ], partyAccId , amount, 'Payment Voucher');
  
 }catch (error)
  {
     return { message: 'Error adding document', dato : dto as any , userId : userId};
  }
  }


  async getPartyAccountId(companyId: number, partyId: number) {
  const account = await Account.findOne({
    where: {
      companyId,
      partyId,
      type: AccountType.PARTY,
      isActive: true,
    },
  });

  if (!account) {
    console.log(`Party account not found for partyId: ${partyId}`);
    throw new Error('Party account not found');
  }
console.log(`Party account id:`, account.id);
  return account.id;
}

async getPaymentAccountId(
  companyId: number,
  mode: 'CASH' | 'BANK' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE' | 'UPI',
) {

  if (mode !== 'CASH' && mode !== 'BANK' && mode !== 'BANK_TRANSFER' && mode !== 'CHEQUE' && mode !== 'ONLINE' && mode !== 'UPI') {
    throw new Error('Invalid payment mode');
  }
  if (mode != 'CASH') {
    mode = 'BANK';
  }

  const account = await Account.findOne({
    where: {
      companyId,
      type: mode,
      isActive: true,
    },
  });

  if (!account) {
    console.log(`Payment account not found for mode: ${mode}`);
    throw new Error(`${mode} account not found`);

  }
   console.log(`${mode} account id:`, account.id);
  return account.id;
}



 
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
