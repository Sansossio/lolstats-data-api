import { Test, TestingModule } from '@nestjs/testing'
import { InformationService } from './information.service'
import { ConfigService } from '../config/config.service'
import { RiotApiService } from '../riot-api/riot-api.service'
import { restore, stub } from 'sinon'

describe('InformationService', () => {
  let service: any

  beforeEach(async () => {
    restore()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        RiotApiService,
        InformationService
      ]
    }).compile()

    service = module.get<InformationService>(InformationService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return current version', async () => {
    const version = '1.0.0'
    stub(service.riot, 'getLolApi')
      .callsFake(() => ({
        DataDragon: {
          getVersions () {
            return [version, '2.0.0']
          }
        }
      }))
    const getVersion = await service.getCurrentVersion()
    expect(getVersion).toEqual({ version })
  })
})
