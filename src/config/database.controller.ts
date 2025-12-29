import { Controller, Delete, Get, Post , Body, UseGuards } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DropTablesDto } from './db.dto';
import { JwtAuthGuard } from 'src/utils/auth/jwt.auth.guard';

@Controller('db')
export class DatabaseController {
  constructor(private readonly db: DatabaseService) {}
  @UseGuards(JwtAuthGuard)
  @Get('tables')
  getAll() {
    return this.db.getAllTablesWithData();
  }

  @Get('test')
  test() {
    return "Database Controller is working";
  }
  @UseGuards(JwtAuthGuard)
  @Delete('drop-all')
  dropAll() {
    return this.db.dropAllTables();
  }
  @UseGuards(JwtAuthGuard)
  @Post('drop-tables')
  async dropTables(@Body() dto: DropTablesDto) {
    return this.db.dropTables(dto.tables);
  }


}
