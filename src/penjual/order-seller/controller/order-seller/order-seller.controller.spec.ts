import { Test, TestingModule } from '@nestjs/testing';
import { OrderSellerController } from './order-seller.controller';

describe('OrderSellerController', () => {
  let controller: OrderSellerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderSellerController],
    }).compile();

    controller = module.get<OrderSellerController>(OrderSellerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
