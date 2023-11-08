import { Module } from '@nestjs/common';
import { ReportController } from './controller/report/report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerHistory])],
  controllers: [ReportController],
  providers: [BuyerHistoryService],
})
export class ReportModule {}
