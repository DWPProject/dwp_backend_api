import { Module } from '@nestjs/common';
import { ReportSellerController } from './controller/report-seller/report-seller.controller';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerHistory])],
  controllers: [ReportSellerController],
  providers: [BuyerHistoryService],
})
export class ReportSellerModule {}
