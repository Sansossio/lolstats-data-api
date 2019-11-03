import { Test, TestingModule } from '@nestjs/testing'
import { SummonerLeaguesService } from './summoner-leagues.service'

describe('SummonerLeaguesService', () => {
  let service: SummonerLeaguesService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SummonerLeaguesService]
    }).compile()
    service = module.get<SummonerLeaguesService>(SummonerLeaguesService)
  })
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
