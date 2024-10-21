import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/clodinary/clodinary.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, PrismaService, CloudinaryService],
})
export class ArticleModule { }
