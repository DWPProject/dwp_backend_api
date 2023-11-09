import { Module } from '@nestjs/common';
import { OverviewController } from './controller/overview/overview.controller';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { OrderProduct } from 'recipe/entities/OrderProduct';
import { OrderService } from '../order/service/order/order.service';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerHistory, OrderProduct])],
  controllers: [OverviewController],
  providers: [BuyerHistoryService, OrderService],
})
export class OverviewModule {}
