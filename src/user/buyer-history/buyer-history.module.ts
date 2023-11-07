import { Module } from '@nestjs/common';
import { BuyerHistoryService } from './service/buyer-history/buyer-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { OrderService } from 'src/admin/order/service/order/order.service';
import { OrderProduct } from 'recipe/entities/OrderProduct';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerHistory, OrderProduct])],
  providers: [BuyerHistoryService, OrderService],
})
export class BuyerHistoryModule {}
