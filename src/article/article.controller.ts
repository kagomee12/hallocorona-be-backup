import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Roles } from '../guard/roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('doctor')
  @Post()
  @UseInterceptors(FileInterceptor('picture'))
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('patient')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
