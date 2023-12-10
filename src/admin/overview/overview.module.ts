import { Module } from '@nestjs/common';
import { OverviewController } from './controller/overview/overview.controller';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { OrderProduct } from 'recipe/entities/OrderProduct';
import { OrderService } from '../order/service/order/order.service';
import { EmailService } from 'src/mailtrap/service/service.service';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerHistory, OrderProduct])],
  controllers: [OverviewController],
  providers: [BuyerHistoryService, OrderService, EmailService],
})
export class OverviewModule {}
