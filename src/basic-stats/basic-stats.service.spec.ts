import { Test, TestingModule } from '@nestjs/testing'
import { stub, restore } from 'sinon'
import { BasicTftStatsService } from './basic-tft-stats.service'
import { DatabaseTestProviders } from '../database/database.providers'

describe('BasicStatsService', () => {
  let service: BasicTftStatsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...DatabaseTestProviders,
        BasicTftStatsService
      ]
    }).compile()

    service = module.get<BasicTftStatsService>(BasicTftStatsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('Update summoner', () => {
    it('should return undefined when match history isn\'t an array', async () => {
      stub((service as any).tftRepository, 'find')
        .onFirstCall()
        .returns(Promise.resolve(1))
      const summoner = await service.updateSummoner({ _id: '', puuid: '' })
      expect(summoner).toEqual(undefined)
      restore()
    })

    it('should return object when match history lenght is zero', async () => {
      stub((service as any).tftRepository, 'find')
        .onFirstCall()
        .returns(Promise.resolve([]))

      const summoner = await service.updateSummoner({ _id: '', puuid: '' })
      if (!summoner) {
        throw new Error('Bad response')
      }
      expect(summoner).toBeDefined()
      expect(summoner.matches).toEqual(0)
      expect(summoner).toHaveProperty('byTraits')
      expect(summoner).toHaveProperty('byQueues')
      restore()
    })
  })
})
