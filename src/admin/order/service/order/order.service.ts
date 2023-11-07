import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from 'recipe/entities/OrderProduct';
import { CreateOrderProductParams } from 'recipe/utils/orderProduct';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderProduct)
    private orderProductRepo: Repository<OrderProduct>,
  ) {}

  async createOrderProduct(
    createOrderProductParams: CreateOrderProductParams,
    manager: EntityManager,
  ) {
    return manager.transaction(async (transactionManager) => {
      const data = new OrderProduct();
      data.buyerHistory = createOrderProductParams.buyerHistoryId;
      data.product = createOrderProductParams.produkId;
      data.quantity = createOrderProductParams.quantity;

      return await transactionManager.save(OrderProduct, data);
    });
  }
}
