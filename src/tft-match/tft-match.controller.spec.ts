import { Test, TestingModule } from '@nestjs/testing';
import { TftMatchController } from './tft-match.controller';

describe('TftMatch Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [TftMatchController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: TftMatchController = module.get<TftMatchController>(TftMatchController);
    expect(controller).toBeDefined();
  });
});
