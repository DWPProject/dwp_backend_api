import { Module } from '@nestjs/common';
import { ProductController } from './controller/product/product.controller';
import { ProductService } from './service/product/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produk } from 'recipe/entities/Produk';
import { UploadService } from 'src/cloudinary/service/service.service';

@Module({
  imports: [TypeOrmModule.forFeature([Produk])],
  controllers: [ProductController],
  providers: [ProductService, UploadService],
})
export class ProductModule {}
