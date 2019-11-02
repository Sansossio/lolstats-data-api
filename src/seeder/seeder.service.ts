import { Injectable, Logger } from '@nestjs/common'
import { RiotApiService } from '../riot-api/riot-api.service'
import { StaticDataService } from '../static-data/static-data.service'

const context = 'SEED'

@Injectable()
export class SeederService {
  private readonly api = this.riot.getLolApi().DataDragon

  constructor (
    private readonly staticData: StaticDataService,

    private readonly riot: RiotApiService
  ) {}

  // Internal methods
  private async seasons () {
    try {
      const seasons = await this.api.getSeasons()
      await this.staticData.createSeasons(seasons)
      Logger.log('Seasons finish', context)
    } catch (e) {
      Logger.error(e, context)
    }
  }

  private async maps () {
    try {
      const maps = await this.api.getMaps()
      await this.staticData.createMaps(maps)
      Logger.log('Maps finish', context)
    } catch (e) {
      Logger.error(e, context)
    }
  }

  private async queues () {
    try {
      const queues = await this.api.getQueues()
      await this.staticData.createQueues(queues)
      Logger.log('Queues finish', context)
    } catch (e) {
      Logger.error(e, context)
    }
  }

  // Public
  async seed () {
    await this.queues()
    await this.seasons()
    await this.maps()
  }
}
