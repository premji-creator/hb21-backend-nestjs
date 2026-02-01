import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/utils/auth/jwt.auth.guard';
import { User } from '../../utils/decorators/user.decorator'
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateUserDto,@User('sub') userId: number) {
    return this.usersService.create(body,userId);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
