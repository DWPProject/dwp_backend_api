import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryProvider } from './provider';

describe('Provider', () => {
  let provider: Provider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryProvider],
    }).compile();

    provider = module.get<Provider>(CloudinaryProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
