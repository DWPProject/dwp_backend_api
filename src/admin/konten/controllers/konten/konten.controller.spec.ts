import { Test, TestingModule } from '@nestjs/testing';
import { KontenController } from './konten.controller';

describe('KontenController', () => {
  let controller: KontenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KontenController],
    }).compile();

    controller = module.get<KontenController>(KontenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
