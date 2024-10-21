import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../clodinary/clodinary.service';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService, private cloudinary: CloudinaryService) { }

  async create(createArticleDto: { title: string; content: string; authorId: number; categoryId: number; picture?: string }, file: Express.Multer.File) {
    try {
      if (file) {
        const result = await this.cloudinary.uploadImage(file);
        createArticleDto.picture = result.url;
      }

      const newArticle = await this.prisma.article.create({
        data: {
          title: createArticleDto.title,
          content: createArticleDto.content,
          picture: createArticleDto.picture,
          author: { connect: { id: createArticleDto.authorId } },
          Category: { connect: { id: createArticleDto.categoryId } },
        },
      });

      return { message: 'Article created successfully', data: newArticle };
    } catch (error) {
      throw new HttpException({ message: 'Failed to create article', error: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

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

  async findOne(id: number) {
    try {
      const article = await this.prisma.article.findUnique({ where: { id }, include: { author: true } });

      if (!article) {
        throw new HttpException({ message: 'Article not found' }, HttpStatus.NOT_FOUND);
      }

      return { message: 'Article fetched successfully', data: article };
    } catch (error) {
      throw new HttpException({ message: 'Failed to fetch article', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number) {
    try {
      const deletedArticle = await this.prisma.article.deleteMany({ where: { id } });

      if (!deletedArticle.count) {
        throw new HttpException({ message: 'Article not found' }, HttpStatus.NOT_FOUND);
      }

      return { message: 'Article deleted successfully', data: deletedArticle };
    } catch (error) {
      throw new HttpException({ message: 'Failed to delete article', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
