import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Company } from './company.model';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { AuthModule } from '../../utils/auth/auth.module';
@Module({
  imports: [SequelizeModule.forFeature([Company]), AuthModule],
  providers: [CompanyService],
  controllers: [CompanyController],
  
})
export class CompanyModule {}
