import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentMaster } from './document-master.model';
import { DocumentDetail } from './document-detail.model';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';


@Module({
  imports: [SequelizeModule.forFeature([DocumentMaster, DocumentDetail])],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
