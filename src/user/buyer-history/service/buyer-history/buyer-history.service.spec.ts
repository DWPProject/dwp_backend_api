import { Test, TestingModule } from '@nestjs/testing';
import { BuyerHistoryService } from './buyer-history.service';

describe('BuyerHistoryService', () => {
  let service: BuyerHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyerHistoryService],
    }).compile();

    service = module.get<BuyerHistoryService>(BuyerHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
