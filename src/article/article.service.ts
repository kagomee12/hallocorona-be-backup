import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../clodinary/clodinary.service';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService, private cloudinary: CloudinaryService) { }

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    filter?: Prisma.ArticleWhereInput;
    orderBy?: Prisma.ArticleOrderByWithRelationInput;
  }) {
    try {
      const filters = [];

      if (params.filter) {
        filters.push(params.filter);
      }

      if (params.search) {
        filters.push({
          OR: [
            { title: { contains: params.search, mode: 'insensitive' } },
            { content: { contains: params.search, mode: 'insensitive' } },
          ],
        });
      }

      const articles = await this.prisma.article.findMany({
        where: {
          AND: filters.length > 0 ? filters : undefined,
        },
        include: { author: true, Category: true },
        skip: params.skip || 0,
        take: params.take || 10,
        orderBy: params.orderBy || { createdAt: 'desc' },
      });

      return { message: 'Articles fetched successfully', data: articles };
    } catch (error) {
      throw new HttpException({ message: 'Failed to fetch articles', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
