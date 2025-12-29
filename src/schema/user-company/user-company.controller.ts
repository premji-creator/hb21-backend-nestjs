import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserCompanyService } from './user-company.service';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { CompanyRole } from './user-company.model';

@Controller('user-company')
export class UserCompanyController {
  constructor(private readonly service: UserCompanyService) {}

  // 🔗 Map user to company with role
  @Post()
  async create(@Body() dto: CreateUserCompanyDto) {
    const exists = await this.service.findMapping(
      dto.userId,
      dto.companyId,
    );

    if (exists) {
      throw new ConflictException('User already mapped to this company');
    }

    return this.service.create(dto);
  }

  // 👥 Get all users of a company
  @Get('company/:companyId')
  findUsersByCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return this.service.findUsersByCompany(companyId);
  }

  // ✏️ Update role
  @Put(':id/role')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: CompanyRole,
  ) {
    return this.service.updateRole(id, role);
  }

  // ❌ Remove user from company
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const removed = await this.service.remove(id);

    if (!removed) {
      throw new NotFoundException('Mapping not found');
    }

    return { deleted: true };
  }
}
