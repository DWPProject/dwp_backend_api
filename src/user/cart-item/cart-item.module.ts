import { Module } from '@nestjs/common';
import { CartItemController } from './controllers/cart-item/cart-item.controller';
import { CartItemService } from './service/cart-item/cart-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from 'recipe/entities/CartItem';
import { ProductService } from 'src/admin/product/service/product/product.service';
import { Produk } from 'recipe/entities/Produk';
import { BuyerHistoryService } from '../buyer-history/service/buyer-history/buyer-history.service';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { OrderService } from 'src/admin/order/service/order/order.service';
import { OrderProduct } from 'recipe/entities/OrderProduct';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem, Produk, BuyerHistory, OrderProduct]),
  ],
  controllers: [CartItemController],
  providers: [
    CartItemService,
    ProductService,
    BuyerHistoryService,
    OrderService,
    OrderService,
  ],
})
export class CartItemModule {}
