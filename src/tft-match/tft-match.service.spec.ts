import { Test, TestingModule } from '@nestjs/testing'
import { TftMatchService } from './tft-match.service'
import { ConfigModule } from '../config/config.module'
import { SummonerService } from '../summoner/summoner.service'
import { BasicTftStatsService } from '../basic-stats/basic-tft-stats.service'
import { SummonerLeaguesService } from '../summoner-leagues/summoner-leagues.service'
import { DatabaseTestProviders } from '../database/database.providers'
import { RiotApiService } from '../riot-api/riot-api.service'
import { StaticDataService } from '../static-data/static-data.service'
import { stub, restore } from 'sinon'

describe('TftMatchService', () => {
  let service: any & TftMatchService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule
      ],
      providers: [
        ...DatabaseTestProviders,
        StaticDataService,
        RiotApiService,
        BasicTftStatsService,
        SummonerLeaguesService,
        SummonerService,
        TftMatchService
      ]
    }).compile()
    service = module.get<TftMatchService>(TftMatchService)
  })
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  describe('Match', () => {
    it('return valid match instance', async () => {
      const match = { matchId: 1 }
      stub(service.api, 'get').onFirstCall().returns({ response: { match } })
      const response = await service.getMatch()
      expect(response).toEqual({ match })
      restore()
    })
  })
})
