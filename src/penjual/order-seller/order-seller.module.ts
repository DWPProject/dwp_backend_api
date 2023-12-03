import { Module } from '@nestjs/common';
import { OrderSellerController } from './controller/order-seller/order-seller.controller';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { OrderService } from 'src/admin/order/service/order/order.service';
import { OrderProduct } from 'recipe/entities/OrderProduct';
import { EmailService } from 'src/mailtrap/service/service.service';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerHistory, OrderProduct])],
  controllers: [OrderSellerController],
  providers: [BuyerHistoryService, OrderService, EmailService],
})
export class OrderSellerModule {}
