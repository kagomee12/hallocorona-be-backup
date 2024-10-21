import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly prismaService: PrismaService) { }

  @Get()
  findAll() {
    return this.prismaService.article.findMany()
  }
}
