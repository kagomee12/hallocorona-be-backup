import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.article.findMany()
  }

}
