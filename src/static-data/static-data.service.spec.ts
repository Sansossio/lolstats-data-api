import { Test, TestingModule } from '@nestjs/testing'
import { StaticDataService } from './static-data.service'
import { RiotApiService } from '../riot-api/riot-api.service'
import { ConfigService } from '../config/config.service'
import { DatabaseTestProviders } from '../database/database.providers'

describe('StaticDataService', () => {
  let service: StaticDataService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...DatabaseTestProviders,
        ConfigService,
        RiotApiService,
        StaticDataService
      ]
    }).compile()
    service = module.get<StaticDataService>(StaticDataService)
  })
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
