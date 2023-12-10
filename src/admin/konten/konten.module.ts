import { Module } from '@nestjs/common';
import { KontenController } from './controllers/konten/konten.controller';
import { KontenService } from './service/konten/konten.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Berita } from 'recipe/entities/Berita';
import { UploadService } from 'src/cloudinary/service/service.service';

@Module({
  imports: [TypeOrmModule.forFeature([Berita])],
  controllers: [KontenController],
  providers: [KontenService, UploadService],
})
export class KontenModule {}
