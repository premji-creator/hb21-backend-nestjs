import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../../utils/auth/auth.module';
import { UserCompany } from '../user-company/user-company.model';
@Module({
  imports: [SequelizeModule.forFeature([User,UserCompany]),AuthModule],
  providers: [UserService],
  controllers: [UserController],
  
})
export class UsersModule {}
