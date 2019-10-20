import { Test, TestingModule } from '@nestjs/testing'
import { RiotApiService } from './riot-api.service'
import { ConfigModule } from '../config/config.module'
import { RiotApi } from 'lolstats-common/src/modules/riot'
import { LolApi } from 'lolstats-common/src/modules/riot/apis'

describe('RiotServiceService', () => {
  let service: RiotApiService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [RiotApiService]
    }).compile()
    service = module.get<RiotApiService>(RiotApiService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return valid riot games instance', () => {
    const value = service.getApi()
    expect(value).toBeInstanceOf(RiotApi)
  })

  it('should return valid league of legends instance', () => {
    const value = service.getLolApi()
    expect(value).toBeInstanceOf(LolApi)
  })
})
