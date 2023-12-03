import { Module } from '@nestjs/common';
import { ReportController } from './controller/report/report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';
import { OrderService } from '../order/service/order/order.service';
import { OrderProduct } from 'recipe/entities/OrderProduct';
import { EmailService } from 'src/mailtrap/service/service.service';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerHistory, OrderProduct])],
  controllers: [ReportController],
  providers: [BuyerHistoryService, OrderService, EmailService],
})
export class ReportModule {}
