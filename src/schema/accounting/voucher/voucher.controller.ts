import { Controller, Get, Post, Put, Delete, Param, Body,UseGuards,Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../../utils/auth/jwt.auth.guard'; 

import { User } from '../../../utils/decorators/user.decorator'
import { VoucherService } from './voucher.service';
import { VoucherType } from './voucher.model';

interface VoucherDto {
  companyId: number;
  partyAccountId: number;
  amount: number;
  cashReceived?: number;
}

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherservice: VoucherService) {}

  // @Post('sale')
  // sale(@Body() body: VoucherDto) {

  //   return this.service.sale(body.companyId, body.partyAccountId, body.amount, body.cashReceived!);
  // }


  // @Post('purchase')
  // purchase(@Body() dto: VoucherDto) {
  //   return this.service.purchase(dto.companyId, dto.partyAccountId, dto.amount);
  // }

  // @Post('receipt')
  // receipt(@Body() dto: VoucherDto) {
  //   return this.service.sale(dto.companyId, dto.partyAccountId, dto.amount, dto.amount);
  // }

  // @Post('new-payment')
  // payment(@Body() dto: VoucherDto) {
  //   return this.service.payment(dto.companyId, dto.partyAccountId, dto.amount);
  // }


      @UseGuards(JwtAuthGuard)
      @Post('new-payment')
      addnewPayment(@Body() body: any,@User('sub') userId: number) {
        return this.voucherservice.payment(body,userId);
      }

        @UseGuards(JwtAuthGuard)
      @Post('new-receipt')
      addnewReceipt(@Body() body: any,@User('sub') userId: number) {
        return this.voucherservice.receipt(body,userId);
      }

       @UseGuards(JwtAuthGuard)
          @Get('payments')
          getpayments(@Req() req: any) {
            console.log("Fetching req.........:",req.user);
            return this.voucherservice.findAllpayments(req.user.sub);
          }
  @UseGuards(JwtAuthGuard)
          @Get('receipts')
          getreceipts(@Req() req: any) {
            console.log("Fetching req.........:",req.user);
            return this.voucherservice.findAllreceipts(req.user.sub);
          }

          


  // @Post('sales-return')
  // salesReturn(@Body() dto: VoucherDto) {
  //   return this.service.salesReturn(dto.companyId, dto.partyAccountId, dto.amount);
  // }

  // @Post('purchase-return')
  // purchaseReturn(@Body() dto: VoucherDto) {
  //   return this.service.purchaseReturn(dto.companyId, dto.partyAccountId, dto.amount);
  // }
}
