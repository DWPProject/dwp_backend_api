import { Module } from '@nestjs/common';
import { BuyerHistoryService } from './service/buyer-history/buyer-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { OrderService } from 'src/admin/order/service/order/order.service';
import { OrderProduct } from 'recipe/entities/OrderProduct';
import { ReportController } from 'src/admin/report/controller/report/report.controller';
import { User } from 'recipe/entities/Users';
import { EmailService } from 'src/mailtrap/service/service.service';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerHistory, OrderProduct])],
  controllers: [ReportController],
  providers: [BuyerHistoryService, OrderService, EmailService],
})
export class BuyerHistoryModule {}
