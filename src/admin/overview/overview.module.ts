import { Module } from '@nestjs/common';
import { OverviewController } from './controller/overview/overview.controller';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerHistory])],
  controllers: [OverviewController],
  providers: [BuyerHistoryService],
})
export class OverviewModule {}
