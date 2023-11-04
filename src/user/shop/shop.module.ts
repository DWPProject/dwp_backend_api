import { Module } from '@nestjs/common';
import { ShopController } from './controllers/shop/shop.controller';
import { CartItemService } from '../cart-item/service/cart-item/cart-item.service';
import { ProductService } from 'src/admin/product/service/product/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produk } from 'recipe/entities/Produk';
import { CartItem } from 'recipe/entities/CartItem';
import { BuyerHistoryService } from '../buyer-history/service/buyer-history/buyer-history.service';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';

@Module({
  imports: [TypeOrmModule.forFeature([Produk, CartItem, BuyerHistory])],
  controllers: [ShopController],
  providers: [CartItemService, ProductService, BuyerHistoryService],
})
export class ShopModule {}
