import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserCompany } from '../user-company/user-company.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
      @InjectModel(UserCompany)
        private readonly usercompanymodel: typeof UserCompany,
  ) {}

  async create(dto: CreateUserDto,userId: number) {

     const existing = await this.userModel.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    const dataToCreate = {
      ...dto,
      password: hashedPassword,
    };
    const usere = await this.userModel.create(dataToCreate as any);

      const userCompany =  await this.usercompanymodel.findOne({
          where: { userId },
        });
        if (!userCompany) {
          throw new Error('User company not found');
        }
        const companyId = userCompany.companyId;

      const mapToCreate = {
       companyId : companyId,
       userId : usere.id,
       role : 'ADMIN'
    };

     return this.usercompanymodel.create(mapToCreate as any);
  
    
  }

  findAll() {
    return this.userModel.findAll();
  }
}
