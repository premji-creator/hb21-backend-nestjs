import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Company } from 'src/schema/company/company.model';
// import { User } from 'src/schema/user/user.model'; // Assuming you have a User model

@Table({ tableName: 'audit_trails', updatedAt: false }) // Often audit logs are immutable
export class AuditTrail extends Model<AuditTrail> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @Column
  userId: number; // The person who made the change

  @Column
  action: 'CREATE' | 'UPDATE' | 'DELETE';

  @Column
  modelName: string; // e.g., 'Account'

  @Column
  recordId: number; // The ID of the account/party being changed

  @Column(DataType.JSON)
  oldValue: any; // State before change

  @Column(DataType.JSON)
  newValue: any; // State after change

  @Column(DataType.STRING)
  ipAddress?: string;

  @BelongsTo(() => Company)
  company: Company;
}