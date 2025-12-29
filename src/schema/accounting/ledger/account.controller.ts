import { Controller, Get, Post, Put, Delete, Param, Body,UseGuards } from '@nestjs/common';


import { AccountService } from './account.service';


@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}


  @Get()
  findAll() {
    return this.accountService.findAll();
  }

}
