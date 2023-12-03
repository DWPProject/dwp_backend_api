import { Module } from '@nestjs/common';
import { ShopController } from './controllers/shop/shop.controller';
import { CartItemService } from '../cart-item/service/cart-item/cart-item.service';
import { ProductService } from 'src/admin/product/service/product/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produk } from 'recipe/entities/Produk';
import { CartItem } from 'recipe/entities/CartItem';
import { BuyerHistoryService } from '../buyer-history/service/buyer-history/buyer-history.service';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { OrderService } from 'src/admin/order/service/order/order.service';
import { OrderProduct } from 'recipe/entities/OrderProduct';
import { UploadService } from 'src/cloudinary/service/service.service';
import { EmailService } from 'src/mailtrap/service/service.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Produk, CartItem, BuyerHistory, OrderProduct]),
  ],
  controllers: [ShopController],
  providers: [
    CartItemService,
    ProductService,
    BuyerHistoryService,
    OrderService,
    UploadService,
    EmailService,
  ],
})
export class ShopModule {}
