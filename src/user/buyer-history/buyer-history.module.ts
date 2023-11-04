import { Module } from '@nestjs/common';
import { BuyerHistoryService } from './service/buyer-history/buyer-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerHistory])],
  providers: [BuyerHistoryService],
})
export class BuyerHistoryModule {}
