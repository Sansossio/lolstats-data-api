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
import { Regions } from 'twisted/dist/constants'

describe('TftMatchService', () => {
  let service: any & TftMatchService
  let module: TestingModule
  beforeAll(async () => {
    module = await Test.createTestingModule({
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

  afterAll(async () => {
    await module.close()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('Match', () => {
    it('should return valid match instance', async () => {
      const match = { matchId: 1 }
      stub(service.api, 'get')
        .onFirstCall()
        .returns(Promise.resolve({ response: { match } }))
      const response = await service.getMatch()
      expect(response).toEqual({ match })
      restore()
    })

    it('should return summoners mappers', async () => {
      const user = {
        user: 'hide on bush'
      }
      stub(service.summonerService, 'get')
        .onFirstCall()
        .returns(Promise.resolve(user))
      const currentPuuid = 'id'
      const puuids = [1]
      const mapUsers = await service.matchSummoners(currentPuuid, puuids)
      expect(mapUsers).toEqual([user])
      restore()
    })

    describe('Create match', () => {
      it('should return existing instance', async () => {
        const match = { match: 1 }
        stub(service.repository, 'findOne')
          .onFirstCall()
          .returns(Promise.resolve(match))
        const response = await service.createMatch(undefined, undefined, Regions.AMERICA_NORTH)
        expect(response).toEqual(match)
        restore()
      })

      it('should return new match', async () => {
        const newMatch = { match: 1 }
        stub(service.repository, 'findOne')
          .onFirstCall()
          .returns(Promise.resolve(null))

        stub(service.repository, 'create')
          .onFirstCall()
          .returns(Promise.resolve(newMatch))

        stub(service, 'getMatch')
          .callsFake(() => Promise.resolve({
            metadata: {
              participants: []
            },
            info: {
              queue_id: 1,
              participants: []
            }
          }))

        stub(service, 'matchSummoners')
          .callsFake(() => Promise.resolve([]))

        stub(service.staticService, 'getQueue')
          .callsFake(() => ({}))

        stub(service.staticService, 'getTftitems')
          .callsFake(() => [])

        stub(service.summonerService, 'insertMatches')
          .callsFake(() => Promise.resolve())

        const response = await service.createMatch(undefined, undefined, Regions.AMERICA_NORTH)
        expect(response).toEqual(newMatch)
        restore()
      })

      it('should return a valid match listing', async () => {
        const list = [0, 1, 2]
        stub(service.api, 'list')
          .callsFake(() => Promise.resolve({ response: list }))

        const response = await service.getMatchListing()
        expect(response).toEqual(list)
      })
    })
  })

  describe('Summoner', () => {
    describe('Update', () => {
      it('should return a valid user updated data', async () => {
        stub(service.summonerService, 'get')
          .callsFake(() => Promise.resolve({ puuid: 1 }))

        stub(service, 'getMatchListing')
          .callsFake(() => Promise.resolve([1, 2, 3]))

        stub(service, 'createMatch')
          .callsFake((_, match) => Promise.resolve({ match }))

        const response = await service.updateSummoner({ region: Regions.AMERICA_NORTH })
        expect(response).toEqual([{ match: 1 }, { match: 2 }, { match: 3 }])
        restore()
      })
    })

    describe('Matches listing', () => {
      it('should return empty array when limit is greater than results', async () => {
        stub(service.summonerService, 'get')
          .callsFake(() => Promise.resolve({ _id: 1 }))

        stub(service.repository, 'countDocuments')
          .callsFake(() => Promise.resolve(1))

        const { data } = await service.getBySummoner({ limit: 1, page: 2 })
        expect(data).toEqual([])
        restore()
      })

      it('should return vlaid array when limit is lower than results', async () => {
        const matches = [1, 2]
        stub(service.summonerService, 'get')
          .callsFake(() => Promise.resolve({ _id: 1 }))

        stub(service.repository, 'countDocuments')
          .callsFake(() => Promise.resolve(10))

        stub(service.repository, 'find')
          .callsFake(() => ({
            limit: () => ({
              skip: () => ({
                sort: () => Promise.resolve(matches)
              })
            })
          }))

        const { data } = await service.getBySummoner({ limit: 1, page: 2 })
        expect(data).toEqual(matches)
        restore()
      })
    })
  })
})
