import { Test, TestingModule } from '@nestjs/testing';
import { TftMatchService } from './tft-match.service';

describe('TftMatchService', () => {
  let service: TftMatchService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TftMatchService],
    }).compile();
    service = module.get<TftMatchService>(TftMatchService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
