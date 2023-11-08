import { Module } from '@nestjs/common';
import { OrderController } from './controller/order/order.controller';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { OrderProduct } from 'recipe/entities/OrderProduct';
import { OrderService } from './service/order/order.service';
import { Produk } from 'recipe/entities/Produk';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerHistory, OrderProduct, Produk])],
  controllers: [OrderController],
  providers: [BuyerHistoryService, OrderService],
})
export class OrderModule {}