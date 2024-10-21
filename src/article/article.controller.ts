import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @Post()
  create(

    @Body()
    createArticleDto: {
      title: string;
      content: string;
      authorId: number;
      categoryId: number;
      picture?: string;
    },
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      createArticleDto.authorId = req.user.id;
      createArticleDto.categoryId = parseInt(req.body.categoryId);
      return this.articleService.create(
        {
          ...createArticleDto,
        },
        file,
      );
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('orderBy') orderBy?: string,
  ) {
    return this.articleService.findAll({
      search,
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      orderBy: orderBy ? { [orderBy]: 'desc' } : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
