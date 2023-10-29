import { Module } from '@nestjs/common';
import { ProductController } from './controller/product/product.controller';
import { ProductService } from './service/product/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produk } from 'recipe/entities/Produk';

@Module({
  imports: [TypeOrmModule.forFeature([Produk])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
