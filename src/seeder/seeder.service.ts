import { Injectable } from '@nestjs/common'
import { RiotApiService } from '../riot-api/riot-api.service'
import { StaticDataService } from '../static-data/static-data.service'

@Injectable()
export class SeederService {
  private readonly api = this.riot.getLolApi().DataDragon

  constructor (
    private readonly staticData: StaticDataService,

    private readonly riot: RiotApiService
  ) {}
  // Internal methods
  private async getQueues () {
    const queues = await this.api.getQueues()
    await this.staticData.createQueues(queues)
  }

  // Public
  async seed () {
    await this.getQueues()
  }
}
