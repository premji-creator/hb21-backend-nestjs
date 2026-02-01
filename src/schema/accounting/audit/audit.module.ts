import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditTrail } from './audit.trail.model';
import { AuditTrailService } from './audit.trail.service';
import { AuditTrailController } from './audit.trail.controller';
import { AuthModule } from '../../../utils/auth/auth.module';
@Module({
  imports: [SequelizeModule.forFeature([AuditTrail]), AuthModule],
  providers: [AuditTrailService],
  controllers: [AuditTrailController],
  
})
export class AuditTrailModule {}