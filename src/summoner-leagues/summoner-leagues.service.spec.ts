import { stub, restore } from 'sinon'
import { Test, TestingModule } from '@nestjs/testing'
import { SummonerLeaguesService } from './summoner-leagues.service'
import { DatabaseTestProviders } from '../database/database.providers'
import { RiotApiModule } from '../riot-api/riot-api.module'
import { ConfigModule } from '../config/config.module'

describe('SummonerLeaguesService', () => {
  let service: any

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        RiotApiModule
      ],
      providers: [
        ...DatabaseTestProviders,
        SummonerLeaguesService
      ]
    }).compile()
    service = module.get<SummonerLeaguesService>(SummonerLeaguesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('Public methods', () => {
    beforeEach(() => {
      stub(service.api, 'bySummoner')
      stub(service.repository, 'create')
      stub(service.repository, 'find')
    })

    afterEach(() => {
      restore()
    })

    it('should return summoner listing from repository', async () => {
      const listing = ['123']
      service.repository.find
        .onFirstCall()
        .returns(Promise.resolve(listing))
      const response = await service.findHistoric()
      expect(response).toEqual(listing)
    })

    it('should create new instance', async () => {
      const instance = [{ test: 123 }]
      service.repository.create
        .onFirstCall()
        .returns(Promise.resolve(instance))
      const response = await service.create()
      expect(response).toEqual(instance)
    })

    it('should find summoner leagues on riot games', async () => {
      service.api.bySummoner
        .onFirstCall()
        .returns(Promise.resolve({ response: [] }))
      const response = await service.findOnRiot()
      expect(response).toEqual([])
    })
  })
})
