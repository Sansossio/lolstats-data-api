import { Test, TestingModule } from '@nestjs/testing'
import { SeederService } from './seeder.service'
import { DatabaseTestProviders } from '../database/database.providers'
import { RiotApiService } from '../riot-api/riot-api.service'
import { ConfigService } from '../config/config.service'
import { StaticDataService } from '../static-data/static-data.service'

describe('SeederService', () => {
  let service: SeederService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...DatabaseTestProviders,
        StaticDataService,
        ConfigService,
        RiotApiService,
        SeederService
      ]
    }).compile()
    service = module.get<SeederService>(SeederService)
  })
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
