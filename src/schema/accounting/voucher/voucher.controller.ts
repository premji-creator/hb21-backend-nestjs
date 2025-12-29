import { Controller, Get, Post, Put, Delete, Param, Body,UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../utils/auth/jwt.auth.guard'; 


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
  constructor(private readonly service: VoucherService) {}

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

  // @Post('payment')
  // payment(@Body() dto: VoucherDto) {
  //   return this.service.payment(dto.companyId, dto.partyAccountId, dto.amount);
  // }

  // @Post('sales-return')
  // salesReturn(@Body() dto: VoucherDto) {
  //   return this.service.salesReturn(dto.companyId, dto.partyAccountId, dto.amount);
  // }

  // @Post('purchase-return')
  // purchaseReturn(@Body() dto: VoucherDto) {
  //   return this.service.purchaseReturn(dto.companyId, dto.partyAccountId, dto.amount);
  // }
}
