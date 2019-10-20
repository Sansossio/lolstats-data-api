import { Test, TestingModule } from '@nestjs/testing'
import { SummonerService } from './summoner.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { SummonerContextEntity } from './summoner.entity'
import { Repository } from 'typeorm'
import { RiotApiService } from '../riot-api/riot-api.service'
import { LeaguesService } from '../leagues/leagues.service'
import { ConfigService } from '../config/config.service'
import { DBConnection } from '../enum/database-connection.enum'
import { SummonerLeagueContextEntity } from '../leagues/entities/summoner-league.entity'

describe('SummonerService', () => {
  let service: SummonerService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(SummonerContextEntity, DBConnection.CONTEXT),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(SummonerLeagueContextEntity, DBConnection.CONTEXT),
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
