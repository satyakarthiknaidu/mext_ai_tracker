import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ActiveUser } from './user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: any) {
    return this.authService.signup(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@ActiveUser() user: any) {
    return this.authService.validateUser(user.sub);
  }
}
