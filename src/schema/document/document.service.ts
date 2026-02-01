import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import {  Sequelize } from 'sequelize-typescript';
import { DocumentMaster } from './document-master.model';
import { DocumentDetail } from './document-detail.model';
import { UserCompany, CompanyRole } from '../user-company/user-company.model';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Party } from '../party/party.model';


@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(DocumentMaster)
    private documentMasterModel: typeof DocumentMaster,

    @InjectModel(DocumentDetail)
    private documentDetailModel: typeof DocumentDetail,

      @InjectModel(UserCompany)
            private readonly userCompanyModel: typeof UserCompany,

    @InjectConnection()
    private sequelize: Sequelize,
  ) {}







 async addnewDocument(dto: any,userId:number): Promise<{ message: string; saleId: number , dto:any, userId:number}> {

    try{

console.table( dto);
const { party, settings, document } = dto;
  const { head, items, tail } = document;
console.table( head);
console.table( items);
console.table( tail);
         const userCompany =  await this.userCompanyModel.findOne({
          where: { userId },
        });
        if (!userCompany) {
          throw new Error('User company not found');
        }
        const companyId = userCompany.companyId;
        dto.companyId = companyId;

      

      try {

        
const newDocNo = await this.generateDocumentNumber(dto.companyId,head.type);
const documentToSave = {
  companyId: dto.companyId,
  userId: userId,
  partyId : head.partyId,
  type: head.type,
  documentNo: newDocNo,
  documentDate: head.documentDate || new Date(),
  totalAmount: tail.total,
  round_off: dto.round_off || 0,
  discount_amount: tail.discount || 0,
  notes: head.notes,
  status: 'DRAFT',
};
console.table(documentToSave);

await this.sequelize.transaction(async (t) => {

const result = await this.documentMasterModel.create(documentToSave as any)


                    const details = items.map((item: any) => ({
                          ...item,
                        productName: JSON.stringify({
                        serviceId: item.serviceId,
                        itemId: item.itemId,
                        name: item.item,
                        service: item.service,                       
                        size: item.size
                      }),
                          documentMasterId: result.id,
                        }));
                  await this.documentDetailModel.bulkCreate(details as any,{ transaction: t });
                  

                      })

         return { message: 'Document added successfully', saleId: 1 , dto, userId}; 
      
      } catch (error) {
        console.error('Error adding document:', error);
        return { message: 'Error adding document', saleId: 0 , dto, userId};
      }

    }
    catch (err) {
      console.error('Error adding document:', err);
        return { message : 'Error adding document', saleId: 0 , dto, userId};
    }
  }

async findAllDocuments(userId:number): Promise<{ message: string; list:any, userId:number}> {
  try{
      const userCompany = await this.userCompanyModel.findOne({
            where: { userId },
          });
          const data = await this.documentMasterModel.findAll({
            where: { companyId: userCompany?.companyId },
            include: [DocumentDetail,Party],
          });
         
          return { message : 'success', list : data, userId};
  }
  catch(err)
  {
     return { message : 'success', list : null, userId};
  }
}

 async findOne(userId:number, id: number ) : Promise<{ message: string; doc:any, userId:number}> {
  try{
    console.log('id',id)
      const userCompany = await this.userCompanyModel.findOne({
            where: { userId },
          });
          const data = await this.documentMasterModel.findOne({
            where: { companyId: userCompany?.companyId , id },
            include: [DocumentDetail,Party],
          });
         
          return { message : 'success', doc : data, userId};
  }
  catch(err)
  {
     return { message : 'success', doc : null, userId};
  }
}


  
  async generateDocumentNumber(companyId: number, type: string): Promise<string> {
  
    console.log('Generating document number for type:', type,companyId);
  const lastDocument = await this.documentMasterModel.findOne({
     where: { companyId, type },
    order: [['id', 'DESC']],    
  }); 

  let nextNumber = 1;

  if (lastDocument && lastDocument.documentNo) {
    // 2. Extract the number part using Split
    // If 'SALE-21', split('-') gives ['SALE', '21']
    const parts = lastDocument.documentNo.split('-');
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









}