import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ModelsName } from '../enums/database.enum'
import { ISummonerModel } from '../summoner/models/summoner.interface'
import { Model } from 'mongoose'
import { ITFTMatchModel } from '../tft-match/models/match/tft-match.interface'
import * as utils from './basic-tft-stats.utils'
import { TftMatchEnum, TftMatchStatsEnum } from '../enums/tft-match.enum'
import * as _ from 'lodash'
import * as algorithms from './algorithms/tft'
import { ITftSummonerStatsModel } from './models/tft/basic-stats.interface'
import { GetSummonerQueryDTO } from '../summoner/models/summoner.dto'
import { SummonerService } from '../summoner/summoner.service'

@Injectable()
export class BasicTftStatsService {
  constructor (
    // Database
    @InjectModel(ModelsName.TFT_SUMMONER_STATS) private readonly repository: Model<ITftSummonerStatsModel>,
    @InjectModel(ModelsName.SUMMONER) private readonly summonersRepository: Model<ISummonerModel>,
    @InjectModel(ModelsName.TFT_MATCH) private readonly tftRepository: Model<ITFTMatchModel>,

    // Services
    private readonly summonerService: SummonerService
  ) {}

  private async upsert (condition: any, instance: any) {
    return this.repository.updateOne(condition, instance, { upsert: true })
  }

  private async matchStatsByQueue (
    name: string,
    summoner: string,
    puuid: string,
    matches: Partial<ITFTMatchModel>[],
    queues: number[],
    conditional?: string
  ) {
    for (const queue of queues) {
      const matchesByQueue = matches.filter(match => match.queue && match.queue.queueId === +queue)
      const stats = utils.ObjectResponse(puuid, matchesByQueue)
      const condition = {
        name,
        queue,
        summoner,
        conditional
      }
      const instance = {
        ...condition,
        ...stats
      }
      await this.upsert(condition, instance)
    }
  }

  private async traits (summoner: string, puuid: string, matches: ITFTMatchModel[], queues: number[]) {
    const traits = algorithms.getTraits(puuid, matches)
    for (const trait of traits) {
      const matchFilter = utils.FilterByTrait(trait, puuid, matches)
      await this.matchStatsByQueue(
        TftMatchStatsEnum.BY_TRAIT,
        summoner,
        puuid,
        matchFilter,
        queues,
        trait
      )
    }
  }

  private async items (summoner: string, puuid: string, matches: ITFTMatchModel[], queues: number[]) {
    const items = algorithms.getItems(puuid, matches)
    for (const item of items) {
      const matchFilter = utils.FilterByItem(item.id, puuid, matches)
      await this.matchStatsByQueue(
        TftMatchStatsEnum.BY_ITEMS,
        summoner,
        puuid,
        matchFilter,
        queues,
        String(item.id)
      )
    }
  }

  private globalStats (summoner: string, puuid: string, matches: ITFTMatchModel[]) {
    const stats = utils.ObjectResponse(puuid, matches)
    const globalQueue = 0
    const condition = {
      name: TftMatchStatsEnum.GLOBAL_STATS,
      queue: globalQueue,
      summoner
    }
    const instance = {
      ...condition,
      ...stats
    }
    return this.upsert(condition, instance)
  }

  async updateSummoner (params: GetSummonerQueryDTO) {
    const { _id, puuid } = await this.summonerService.get(params)
    const matchHistory = await this.tftRepository.find({
      participantsIds: _id
    })
    if (!Array.isArray(matchHistory)) {
      return
    }
    const queues = algorithms.getQueues(matchHistory)

    await this.globalStats(_id, puuid, matchHistory)
    await this.traits(_id, puuid, matchHistory, queues)
    await this.items(_id, puuid, matchHistory, queues)
  }

  async get (params: GetSummonerQueryDTO) {
    const { _id } = await this.summonerService.get(params)
    return this.repository.find({
      summoner: _id
    })
  }
}
