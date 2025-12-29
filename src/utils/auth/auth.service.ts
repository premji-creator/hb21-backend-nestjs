import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../schema/user/user.model';
import { Company } from '../../schema/company/company.model';
import { UserCompany } from 'src/schema/user-company/user-company.model';
@Injectable()
export class AuthService {
  
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    console.log("AuthService login called with email:", email, "password:", password);
    const user = await this.userModel.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
    success: true,
    accessToken: this.jwtService.sign(payload),
  };

   
  }

  async getUserDetails(token: string) {
    try {
      console.log("AuthService getUserDetails called with token:", token);
      const decoded = this.jwtService.verify(token);
      const user = await this.userModel.findByPk(decoded.sub, {
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }
//  task: fetch company details and attach to user object

    const userCompany = await UserCompany.findOne({
            where: { userId: user.id },
            include: [
              {
                model: Company,                
              },
            ],
          });

          return {
                    success: true,
                    user,
                    company: userCompany
                      ? {
                          ...userCompany.company.toJSON(),
                          role: userCompany.role,
                        }
                      : null,
                  };


      
    } catch (error) {
      console.log('ee',error)
      throw new UnauthorizedException('Invalid token');
    }
  }
}
