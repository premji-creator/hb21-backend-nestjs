import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserCompany } from './user-company.model';
import { UserCompanyService } from './user-company.service';
import { UserCompanyController } from './user-company.controller';
import { User } from '../user/user.model';
import { Company } from '../company/company.model';

@Module({
  imports: [SequelizeModule.forFeature([UserCompany, User, Company])],
  providers: [UserCompanyService],
  controllers: [UserCompanyController],
})
export class UserCompanyModule {}
