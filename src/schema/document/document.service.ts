import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DocumentMaster } from './document-master.model';
import { DocumentDetail } from './document-detail.model';
import { UserCompany, CompanyRole } from '../user-company/user-company.model';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(DocumentMaster)
    private documentMasterModel: typeof DocumentMaster,

    @InjectModel(DocumentDetail)
    private documentDetailModel: typeof DocumentDetail,

    @InjectConnection()
    private sequelize: Sequelize,
  ) {}

  async createDocument(dto: CreateDocumentDto): Promise<{ message: string; saleId: number }> {
    const { companyId, userId, invoiceDate, items } = dto;

    // 🔐 Role validation
    const mapping = await UserCompany.findOne({
      where: { companyId, userId },
    });

    if (!mapping) {
      throw new ForbiddenException('User not mapped to company');
    }

    // 🚫 Counter staff cannot create sales (example rule)
    if (mapping.role === CompanyRole.COUNTER) {
      throw new ForbiddenException('Permission denied');
    }

    const transaction = await this.sequelize.transaction();

    try {
      const totalAmount = items.reduce(
        (sum, item) => sum + Number(item.amount),
        0,
      );
  

     
      const documentMaster = await this.documentMasterModel.create(
        {
          companyId,
          userId,
          invoiceNo: `INV-${Date.now()}`,
          invoiceDate: new Date(invoiceDate),
          totalAmount,
        },
        { transaction },
      );

   
      const details = items.map(item => ({
        ...item,
        documentMasterId: documentMaster.id,
      }));

      await this.documentDetailModel.bulkCreate(details as any, { transaction });

      await transaction.commit();

      return {
        message: 'Sale created successfully',
        saleId: documentMaster.id,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
