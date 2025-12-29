import { Injectable, BadRequestException,
  Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserCompany } from './user-company.model';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { CompanyRole } from './user-company.model';

import { User } from '../user/user.model';
import { Company } from '../company/company.model';

@Injectable()
export class UserCompanyService {
  
      private readonly logger = new Logger(UserCompanyService.name);
  constructor(
    @InjectModel(UserCompany)
    private readonly usercompanymodel: typeof UserCompany,

     @InjectModel(User)
    private readonly userModel: typeof User,

        @InjectModel(Company)
    private readonly companyModel: typeof Company,

  ) {}

   async create(dto: CreateUserCompanyDto) {

      const user = await this.userModel.findByPk(dto.userId);
    if (!user) {
      this.logger.warn(`User not found: ${dto.userId}`);
      throw new BadRequestException(
        `User ${dto.userId} does not exist`,
      );
    }

    // 🔍 Validate Company
    const company = await this.companyModel.findByPk(dto.companyId);
    if (!company) {
      this.logger.warn(`Company not found: ${dto.companyId}`);
      throw new BadRequestException(
        `Company ${dto.companyId} does not exist`,
      );
    }

    return this.usercompanymodel.create(dto as any);
  
}

  findMapping(userId: number, companyId: number) {
    return this.usercompanymodel.findOne({ where: { userId, companyId } });
  }

  findUsersByCompany(companyId: number) {
    return this.usercompanymodel.findAll({
      where: { companyId },
      include: ['user'],
    });
  }

  async updateRole(id: number, role: CompanyRole) {
    const mapping = await this.usercompanymodel.findByPk(id);
    if (!mapping) return null;

    mapping.role = role;
    return mapping.save();
  }

  async remove(id: number) {
    const mapping = await this.usercompanymodel.findByPk(id);
    if (!mapping) return null;

    await mapping.destroy();
    return true;
  }
}
