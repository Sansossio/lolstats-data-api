import { Injectable, NotFoundException } from '@nestjs/common'
import { IQueueModel } from './models/queue/queue.interface'
import { Model } from 'mongoose'
import { ModelsName } from '../database/database.enum'
import { InjectModel } from '@nestjs/mongoose'
import { QueuesDataDragonDTO } from 'twisted/dist/dto'
import { SeasonDTO } from './models/seasons/seasons.dto'
import { MapsDTO } from './models/maps/maps.dto'
import { ISeasonModel } from './models/seasons/seasons.interface'
import { IMapsModel } from './models/maps/maps.interface'

@Injectable()
export class StaticDataService {
  constructor (
    // Database
    @InjectModel(ModelsName.STATIC_QUEUES) private readonly queuesRepository: Model<IQueueModel>,
    @InjectModel(ModelsName.STATIC_SEASONS) private readonly seasonsRepository: Model<ISeasonModel>,
    @InjectModel(ModelsName.STATIC_MAPS) private readonly mapsRepository: Model<IMapsModel>
  ) {}

  // Controller methods
  async getQueues (id: string): Promise<IQueueModel>
  async getQueues (): Promise<IQueueModel[]>
  async getQueues (id?: string) {
    if (id) {
      const instance = await this.queuesRepository.findOne({ queueId: id })
      if (!instance) {
        throw new NotFoundException()
      }
      return instance
    }
    return this.queuesRepository.find()
  }

  async getSeasons (id: string): Promise<ISeasonModel>
  async getSeasons (): Promise<ISeasonModel[]>
  async getSeasons (id?: string) {
    if (id) {
      const instance = await this.seasonsRepository.findOne({ id })
      if (!instance) {
        throw new NotFoundException()
      }
      return instance
    }
    return this.seasonsRepository.find()
  }

  async getMaps (id: string): Promise<IMapsModel>
  async getMaps (): Promise<IMapsModel[]>
  async getMaps (id?: string) {
    if (id) {
      const instance = await this.mapsRepository.findOne({ mapId: id })
      if (!instance) {
        throw new NotFoundException()
      }
      return instance
    }
    return this.mapsRepository.find()
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

  async createMaps (maps: MapsDTO[]) {
    for (const map of maps) {
      await this.mapsRepository.updateOne({ mapId: map.mapId }, map, { upsert: true })
    }
  }
}
