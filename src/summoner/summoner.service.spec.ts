import { Test, TestingModule } from '@nestjs/testing'
import { SummonerService } from './summoner.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { SummonerEntity } from './summoner.entity'
import { Repository } from 'typeorm'
import { RiotApiService } from '../riot-api/riot-api.service'
import { LeaguesService } from '../leagues/leagues.service'
import { ConfigService } from '../config/config.service'

describe('SummonerService', () => {
  let service: SummonerService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(SummonerEntity),
          useClass: Repository
        },
        ConfigService,
        RiotApiService,
        LeaguesService,
        SummonerService
      ]
    }).compile()
    service = module.get<SummonerService>(SummonerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
