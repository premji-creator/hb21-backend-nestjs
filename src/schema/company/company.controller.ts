import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../utils/auth/jwt.auth.guard';

import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() body: CreateCompanyDto) {
    return this.companyService.create(body);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    console.log("Fetching req.........:",req.user);
    return this.companyService.findOne(Number(id));
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateCompanyDto) {
    return this.companyService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(Number(id));
  }
}
