import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { AuditTrail } from '../../schema/accounting/audit/audit.trail.model';

@Injectable()
export class AuditUtilityService {
  constructor(
    @InjectModel(AuditTrail)
    private auditTrailModel: typeof AuditTrail,
  ) {}

  async updateWithAudit<T extends Model>(
    existingRecord: T,
    newData: any,
    fieldsToAudit: (keyof T)[],
    metadata: { companyId: number; userId: number; modelName: string },
    transaction?: Transaction,
  ): Promise<void> {
    const oldValues: any = {};
    const newValues: any = {};
    let hasChanged = false;

    for (const key of fieldsToAudit) {
      const oldVal = existingRecord[key];
      const newVal = newData[key as string];

      // 1. Normalize and Compare
      const isNumeric = !isNaN(parseFloat(oldVal as any)) && !isNaN(parseFloat(newVal as any));
      
      if (isNumeric) {
        if (parseFloat(oldVal as any) !== parseFloat(newVal as any)) {
          oldValues[key as string] = parseFloat(oldVal as any).toFixed(2);
          newValues[key as string] = parseFloat(newVal as any).toFixed(2);
          hasChanged = true;
        }
      } else if (oldVal?.toString() !== newVal?.toString()) {
        oldValues[key as string] = oldVal;
        newValues[key as string] = newVal;
        hasChanged = true;
      }
    }

    if (hasChanged) {
      // 2. Log to Audit Table
      await this.auditTrailModel.create({
        companyId: metadata.companyId,
        userId: metadata.userId,
        action: 'UPDATE',
        modelName: metadata.modelName,
        recordId: (existingRecord as any).id,
        oldValue: oldValues,
        newValue: newValues,
      } as any, { transaction });

      // 3. Update the actual record
      await existingRecord.update(newData, { transaction });
    }
  }
}