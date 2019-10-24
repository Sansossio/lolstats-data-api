import { Injectable } from '@nestjs/common'
import { RiotApi } from 'api-riot-games'
import { ConfigService } from '../config/config.service'

@Injectable()
export class RiotApiService {
  private readonly api: RiotApi

  constructor (
    private readonly config: ConfigService
  ) {
    const params = {
      key: this.config.get<string>('riot.apiKey'),
      rateLimitRetry: this.config.getBoolean('riot.rateLimitRetry'),
      rateLimitRetryAttempts: this.config.getNumber('riot.rateLimitCount')
    }
    this.api = new RiotApi(params)
  }

  getApi () {
    return this.api
  }

  getLolApi (): typeof RiotApi.prototype.leagueOfLegends {
    return this.api.leagueOfLegends
  }
}
