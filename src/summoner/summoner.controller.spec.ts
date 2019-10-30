import { Test, TestingModule } from '@nestjs/testing';
import { SummonerController } from './summoner.controller';

describe('Summoner Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SummonerController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SummonerController = module.get<SummonerController>(SummonerController);
    expect(controller).toBeDefined();
  });
});
