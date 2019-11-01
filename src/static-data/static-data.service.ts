import { Injectable } from '@nestjs/common'
import { RiotApiService } from '../riot-api/riot-api.service'
import { IQueueModel } from './models/queue/queue.interface'
import { Model } from 'mongoose'
import { ModelsName } from '../database/database.enum'
import { InjectModel } from '@nestjs/mongoose'
import { QueuesDataDragonDTO } from 'twisted/dist/dto'

@Injectable()
export class StaticDataService {
  private readonly api = this.riot.getLolApi().DataDragon

  constructor (
    // Database
    @InjectModel(ModelsName.STATIC_QUEUES) private readonly queuesRepository: Model<IQueueModel>,
    // Services
    private readonly riot: RiotApiService
  ) {}

  // Get queues
  async getQueues () {
    return this.queuesRepository.find()
  }

  async createQueues (queues: QueuesDataDragonDTO[]) {
    for (const queue of queues) {
      await this.queuesRepository.updateOne({ queueId: queue.queueId }, queue, { upsert: true })
    }
  }
}
