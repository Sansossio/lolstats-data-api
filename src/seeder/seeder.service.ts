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
  private async getQueues () {
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
    await this.getQueues()
  }
}
