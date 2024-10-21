import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

@Injectable()
export class AppService {

  constructor(
    private readonly prismaService: PrismaService
  ) { }


  async getHello() {
    return this.prismaService.category.findMany();
  }
}
