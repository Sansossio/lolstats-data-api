import { Test, TestingModule } from '@nestjs/testing'
import { stub, restore } from 'sinon'
import { BasicTftStatsService } from './basic-tft-stats.service'
import { DatabaseTestProviders } from '../database/database.providers'
import { Regions } from 'twisted/dist/constants'
import { SummonerService } from '../summoner/summoner.service'
import { SummonerLeaguesService } from '../summoner-leagues/summoner-leagues.service'
import { RiotApiService } from '../riot-api/riot-api.service'
import { ConfigService } from '../config/config.service'

describe('BasicStatsService', () => {
  let service: BasicTftStatsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...DatabaseTestProviders,
        ConfigService,
        BasicTftStatsService,
        SummonerService,
        SummonerLeaguesService,
        RiotApiService
      ]
    }).compile()

    service = module.get<BasicTftStatsService>(BasicTftStatsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
