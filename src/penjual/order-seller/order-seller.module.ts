import { Module } from '@nestjs/common';
import { OrderSellerController } from './controller/order-seller/order-seller.controller';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerHistory])],
  controllers: [OrderSellerController],
  providers: [BuyerHistoryService],
})
export class OrderSellerModule {}
