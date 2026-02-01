import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditTrail } from './audit.trail.model';

@Injectable()
export class AuditTrailService {
  constructor(
    @InjectModel(AuditTrail)
    private auditModel: typeof AuditTrail,
  ) {}

  async findHistory(modelName: string, recordId: number): Promise<AuditTrail[]> {
    return this.auditModel.findAll({
      where: {
        modelName,
        recordId,
      },
      order: [['createdAt', 'DESC']], // Newest changes first
    });
  }

  async findAll(companyId: number, page: number, limit: number) {
    const offset = (page - 1) * limit;
    return this.auditModel.findAndCountAll({
      where: { companyId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  }
}