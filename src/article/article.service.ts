import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../clodinary/clodinary.service';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService, private cloudinary: CloudinaryService) { }

  async findAll() {
    return this.prisma.article.findMany()
  }

}
