import { Test, TestingModule } from '@nestjs/testing';
import { ReportSellerController } from './report-seller.controller';

describe('ReportSellerController', () => {
  let controller: ReportSellerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportSellerController],
    }).compile();

    controller = module.get<ReportSellerController>(ReportSellerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
