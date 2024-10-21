import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { AuthGuard } from './auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private userService: UsersService) { }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto.username, loginUserDto.password);
  }

  @Post('register')
  async register(@Body() createUserDto: Prisma.UserCreateInput) {
    const hassedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.authService.register({
      ...createUserDto,
      password: hassedPassword
    });
  }


  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Req() req: any) {
    const user = await this.userService.findOne(req.user.id)
    return user.data
  }
}

