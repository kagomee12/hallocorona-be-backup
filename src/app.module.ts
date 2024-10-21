import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { ClodinaryModule } from './clodinary/clodinary.module';

@Module({
  imports: [
    ClodinaryModule, 
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
