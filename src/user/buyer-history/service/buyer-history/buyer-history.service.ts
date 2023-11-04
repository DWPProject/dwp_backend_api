import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerHistory } from 'recipe/entities/BuyerHistory';
import { CreateBuyerHistoryParams } from 'recipe/utils/buyerHistory.utils';
import { RandomStringGenerator } from 'recipe/utils/randomStringGenerator.utils';
import { EntityManager, ManyToMany, Repository } from 'typeorm';

@Injectable()
export class BuyerHistoryService {
  constructor(
    @InjectRepository(BuyerHistory)
    private buyerHistoryRepo: Repository<BuyerHistory>,
  ) {}

  async createHistoryUser(
    createBuyerHistoryParams: CreateBuyerHistoryParams,
    manager: EntityManager,
  ) {
    return manager.transaction(async (transactionManager) => {
      const now = new Date();
      console.log(createBuyerHistoryParams);
      const newHistory = this.buyerHistoryRepo.create({
        id: RandomStringGenerator(),
        ...createBuyerHistoryParams,
        status: 'Belum diProses',
        order_date: now,
        payment_status: false,
      });

      await transactionManager.save(BuyerHistory, newHistory);
    });
  }
}
