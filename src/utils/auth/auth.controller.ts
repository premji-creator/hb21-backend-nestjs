import { Controller, Post,Get, Body , Headers, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto,tokenDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

@Post('login')
login(@Body() dto: LoginDto) {
  return this.authService.login(dto.email, dto.password);
}


 @Get('user-details')
  getUserDetails(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.replace('Bearer ', '');
    return this.authService.getUserDetails(token);
  }

}
