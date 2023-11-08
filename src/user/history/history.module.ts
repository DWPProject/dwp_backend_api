import { Module } from '@nestjs/common';
import { HistoryController } from './controller/history/history.controller';
import { BuyerHistoryService } from '../buyer-history/service/buyer-history/buyer-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerHistory])],
  controllers: [HistoryController],
  providers: [BuyerHistoryService],
})
export class HistoryModule {}
