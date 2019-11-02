import { Injectable, NotFoundException } from '@nestjs/common'
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
  async getQueues (id: string): Promise<IQueueModel>
  async getQueues (): Promise<IQueueModel[]>
  async getQueues (id?: string) {
    if (id) {
      const instance = this.queuesRepository.findOne({ queueId: id })
      if (!instance) {
        throw new NotFoundException()
      }
      return instance
    }
    return this.queuesRepository.find()
  }

  async getSeasons (id: string): Promise<IQueueModel>
  async getSeasons (): Promise<IQueueModel[]>
  async getSeasons (id?: string) {
    if (id) {
      const instance = this.seasonsRepository.findOne({ id })
      if (!instance) {
        throw new NotFoundException()
      }
      return instance
    }
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
