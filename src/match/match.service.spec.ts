import { Test, TestingModule } from '@nestjs/testing'
import { MatchService } from './match.service'
import { DBConnection } from '../enum/database-connection.enum'
import { SummonerMatchesEntity } from './entities/summoner-matches.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('MatchService', () => {
  let service: MatchService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(SummonerMatchesEntity, DBConnection.CONTEXT),
          useClass: Repository
        },
        MatchService
      ]
    }).compile()
    service = module.get<MatchService>(MatchService)
  })
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
