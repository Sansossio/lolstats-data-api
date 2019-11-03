import { Test, TestingModule } from '@nestjs/testing'
import { BasicTftStatsService } from './basic-tft-stats.service'

describe('BasicStatsService', () => {
  let service: BasicTftStatsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BasicTftStatsService]
    }).compile()

    service = module.get<BasicTftStatsService>(BasicTftStatsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
