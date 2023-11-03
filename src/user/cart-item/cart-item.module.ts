import { Module } from '@nestjs/common';
import { CartItemController } from './controllers/cart-item/cart-item.controller';
import { CartItemService } from './service/cart-item/cart-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from 'recipe/entities/CartItem';
import { ProductService } from 'src/admin/product/service/product/product.service';
import { Produk } from 'recipe/entities/Produk';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Produk])],
  controllers: [CartItemController],
  providers: [CartItemService, ProductService],
})
export class CartItemModule {}
