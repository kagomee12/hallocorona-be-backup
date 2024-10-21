import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async login(username: string, pass: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) {
        return { status: 'error', message: 'User not found' };
      }

      const valid = await bcrypt.compare(pass, user.password);
      if (!valid) {
        return { status: 'error', message: 'Wrong password' };
      }

      const { password, ...result } = user;
      const token = await this.jwtService.signAsync(result);

      return {
        status: 'success',
        message: 'Login successful',
        data: token,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Login failed',
        error: error.message,
      };
    }
  }

  async register(createUserDto: Prisma.UserCreateInput): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });

      return {
        status: 'success',
        message: 'User registered successfully',
        data: user,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Registration failed',
        error: error.message,
      };
    }
  }
}
