import { Module } from '@nestjs/common';
import { HistoryController } from './controller/history/history.controller';
import { BuyerHistoryService } from '../buyer-history/service/buyer-history/buyer-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { OrderService } from 'src/admin/order/service/order/order.service';
import { OrderProduct } from 'recipe/entities/OrderProduct';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerHistory, OrderProduct])],
  controllers: [HistoryController],
  providers: [BuyerHistoryService, OrderService],
})
export class HistoryModule {}
