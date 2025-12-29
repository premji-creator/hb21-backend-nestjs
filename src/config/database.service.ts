import { BadRequestException, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DatabaseService {
  constructor(private readonly sequelize: Sequelize) {}

  async getAllTablesWithData() {
    // Get all table names
    const [tables] = await this.sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `);

    const result: Record<string, any[]> = {};

    for (const row of tables as any[]) {
      const tableName = row.table_name as string;
      const [rows] = await this.sequelize.query(`SELECT * FROM \`${tableName}\``);
      result[tableName] = rows as any[];
    }

    return result;
  }

    async dropAllTables() {
    await this.sequelize.drop();
    return {
      message: 'All tables dropped successfully',
    };
  }

    async dropTables(tableNames: string[]) {
    if (!tableNames.length) {
      throw new BadRequestException('No tables provided');
    }

    for (const table of tableNames) {
      // basic protection against SQL injection
      if (!/^[a-zA-Z0-9_]+$/.test(table)) {
        throw new BadRequestException(`Invalid table name: ${table}`);
      }

      await this.sequelize.query(
        `DROP TABLE IF EXISTS \`${table}\``
      );
    }

    return {
      success: true,
      droppedTables: tableNames,
    };
  }
}
