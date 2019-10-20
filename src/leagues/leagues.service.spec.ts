import { Test, TestingModule } from '@nestjs/testing'
import { LeaguesService } from './leagues.service'
import { get } from 'lodash'
import { RiotApiService } from '../riot-api/riot-api.service'
import { RiotApiModule } from '../riot-api/riot-api.module'
import { stub, restore, SinonStub } from 'sinon'
import Regions from 'lolstats-common/src/enum/riot/regions.riot.enum'

describe('LeaguesService', () => {
  let service: LeaguesService
  let spy: jest.SpyInstance

  beforeAll(async () => {
    spy = jest.spyOn(RiotApiService.prototype, 'getLolApi')
    const module: TestingModule = await Test.createTestingModule({
      imports: [RiotApiModule],
      providers: [LeaguesService]
    }).compile()
    service = module.get<LeaguesService>(LeaguesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('internal methods', () => {
    it('should return valid number list from roman string number', () => {
      const converter = get(service, 'romanToInt')
      expect(converter('I')).toEqual(1)
      expect(converter('II')).toEqual(2)
      expect(converter('III')).toEqual(3)
      expect(converter('IV')).toEqual(4)
      expect(converter('V')).toEqual(5)
    })
    it('should return valid map array', async () => {
      const method = get(service, 'mapRank').bind(service)
      const data = [
        {
          rank: 'I'
        }
      ]
      const response = [
        {
          rank: 1
        }
      ]
      expect(method(data)).toEqual(response)
    })
  })

  describe('Api methods', () => {
    let mock: SinonStub

    afterEach(() => {
      restore()
    })

    it('should return summor leagues matched', async () => {
      const expectResponse = [
        {
          rank: 1
        }
      ]
      const api = get(service, 'api')
      stub(api, 'bySummoner').callsFake(() => {
        const response = [
          {
            rank: 'I'
          }
        ]
        return { response }
      })
      const response = await service.bySummoner('Testing', Regions.PBE)
      expect(response).toEqual(expectResponse)
    })
  })
})
