import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuditTrailService } from './audit.trail.service';
import { AuditTrail } from './audit.trail.model';

@Controller('audit-trail')
export class AuditTrailController {
  constructor(private readonly auditService: AuditTrailService) {}
  /**
   * Get history for a specific record (e.g., /audit-trail/Account/1)
   */
  @Get(':modelName/:recordId')
  async getRecordHistory(
    @Param('modelName') modelName: string,
    @Param('recordId') recordId: number,
  ): Promise<AuditTrail[]> {
    return this.auditService.findHistory(modelName, recordId);
  }

  /**
   * Get all logs for a company (with pagination)
   * Example: /audit-trail?page=1&limit=20
   */
  @Get()
  async getAllLogs(
    @Query('companyId') companyId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return this.auditService.findAll(companyId, page, limit);
  }
}