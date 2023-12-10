import { Test, TestingModule } from '@nestjs/testing';
import { KontenService } from './konten.service';

describe('KontenService', () => {
  let service: KontenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KontenService],
    }).compile();

    service = module.get<KontenService>(KontenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
