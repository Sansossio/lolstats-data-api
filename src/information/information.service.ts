import { Injectable } from '@nestjs/common'
import { RiotApiService } from '../riot-api/riot-api.service'
import { VersionDTO } from './dto/version.dto'
import { Cache } from '../cache/cache.decorator'
import { CacheTimes } from '../enums/cache.enum'

@Injectable()
export class InformationService {
  constructor (
    private readonly riot: RiotApiService
  ) {}

  @Cache({ expiration: CacheTimes.CURRENT_VERSION })
  async getCurrentVersion (): Promise<VersionDTO> {
    const [version] = await this.riot.getLolApi().DataDragon.getVersions()
    return {
      version
    }
  }
}
