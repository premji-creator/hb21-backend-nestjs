
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './utils/middleware/logger';
import { DatabaseModule } from './config/database.module';
import { UsersModule } from './schema/user/user.module';
import { CompanyModule } from './schema/company/company.module';
import { DocumentModule } from './schema/document/document-module';
import { UserCompanyModule } from './schema/user-company/user-company.module';
import { AuthModule } from './utils/auth/auth.module';
import { PartyModule } from './schema/party/party.module';
import { AccountModule } from './schema/accounting/ledger/account.module';
import { VoucherModule } from './schema/accounting/voucher/voucher.module';
import { ItemPriceModule } from './schema/master/item/item-price.module';
@Module({
  imports: [
    DatabaseModule,
    CompanyModule,
    UsersModule,
    PartyModule,
    DocumentModule,
    UserCompanyModule,
    AccountModule,
    VoucherModule,
    ItemPriceModule,
    AuthModule
  ],
 
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // logs ALL routes
  }
}