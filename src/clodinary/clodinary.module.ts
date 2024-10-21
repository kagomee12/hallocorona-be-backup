import { Module } from '@nestjs/common';
import { CloudinaryService } from './clodinary.service';
import { CloudinaryProvider } from './clodinary';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class ClodinaryModule {}
