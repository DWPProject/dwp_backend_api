import { Module } from '@nestjs/common';
import { KontenController } from './controllers/konten/konten.controller';
import { KontenService } from './service/konten/konten.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Berita } from 'recipe/entities/Berita';

@Module({
  imports: [TypeOrmModule.forFeature([Berita])],
  controllers: [KontenController],
  providers: [KontenService],
})
export class KontenModule {}
