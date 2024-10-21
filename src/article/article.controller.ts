import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('orderBy') orderBy?: string
  ) {
    return this.articleService.findAll({
      search,
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      orderBy: orderBy ? { [orderBy]: 'desc' } : undefined,
    });
  }
}
