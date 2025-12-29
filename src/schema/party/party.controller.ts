import { Controller, Get, Post, Put, Delete, Param, Body,UseGuards,Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../utils/auth/jwt.auth.guard'; 


import { PartyService } from './party.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { User } from '../../utils/decorators/user.decorator'

@Controller('parties')
export class PartyController {
  constructor(private readonly PartyService: PartyService) {}

  

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@User('sub') userId: number) {
    return this.PartyService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.PartyService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post('new-party')
  addnewParty(@Body() body: CreatePartyDto,@User('sub') userId: number) {
    return this.PartyService.addnewParty(body,userId);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdatePartyDto) {
    return this.PartyService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.PartyService.remove(Number(id));
  }
}
