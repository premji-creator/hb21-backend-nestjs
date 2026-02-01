import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentMaster } from './document-master.model';
import { DocumentDetail } from './document-detail.model';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { AuthModule } from '../../utils/auth/auth.module';
import { UserCompany } from '../user-company/user-company.model'
@Module({
  imports: [SequelizeModule.forFeature([DocumentMaster, DocumentDetail, UserCompany]), AuthModule],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
