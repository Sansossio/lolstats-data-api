import { Injectable } from '@nestjs/common'
import { IQueueModel } from './models/queue/queue.interface'
import { Model } from 'mongoose'
import { ModelsName } from '../database/database.enum'
import { InjectModel } from '@nestjs/mongoose'
import { QueuesDataDragonDTO } from 'twisted/dist/dto'
import { SeasonDTO } from './models/seasons/seasons.dto'

@Injectable()
export class StaticDataService {
  constructor (
    // Database
    @InjectModel(ModelsName.STATIC_QUEUES) private readonly queuesRepository: Model<IQueueModel>,
    @InjectModel(ModelsName.STATIC_SEASONS) private readonly seasonsRepository: Model<IQueueModel>
  ) {}

  // Controller methods
  // Get queues
  async getQueues () {
    return this.queuesRepository.find()
  }

  async getSeasons () {
    return this.seasonsRepository.find()
  }

  // External services mtehods

  async createQueues (queues: QueuesDataDragonDTO[]) {
    for (const queue of queues) {
      await this.queuesRepository.updateOne({ queueId: queue.queueId }, queue, { upsert: true })
    }
  }

  async createSeasons (seasons: SeasonDTO[]) {
    for (const season of seasons) {
      await this.seasonsRepository.updateOne({ id: season.id }, season, { upsert: true })
    }
  }
}
