import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
// import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: Prisma.UserCreateInput) {
    const hassedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.usersService.create({
      ...createUserDto,
      password: hassedPassword
    });
  }

  // @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('profilePic'))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.update(+id, updateUserDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
