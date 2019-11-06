import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ModelsName } from '../enums/database.enum'
import { ISummonerModel } from '../summoner/models/summoner.interface'
import { Model } from 'mongoose'
import { ITFTMatchModel } from '../tft-match/models/match/tft-match.interface'
import * as utils from './basic-tft-stats.utils'
import { TftMatchEnum } from '../enums/tft-match.enum'
import * as _ from 'lodash'
import * as algorithms from './algorithms/tft'

@Injectable()
export class BasicTftStatsService {
  constructor (
    // Database
    @InjectModel(ModelsName.SUMMONER) private readonly summonersRepository: Model<ISummonerModel>,

    @InjectModel(ModelsName.TFT_MATCH) private readonly tftRepository: Model<ITFTMatchModel>
  ) {}

  private byQueue (puuid: string, matches: ITFTMatchModel[]) {
    const queues = algorithms.getQueues(matches)
    const response = {}

    for (const queue of queues) {
      let data = {}
      let key = queue
      // All queues
      if (queue === TftMatchEnum.STATS_TOTAL) {
        data = utils.ObjectResponse(puuid, matches)
      } else {
        // Filter by queueId
        const matchesFiltered = matches.filter(match => match.queue.queueId === +queue)
        data = utils.ObjectResponse(puuid, matchesFiltered)
      }

      _.set(response, key, data)
    }

    return response
  }

  private byTraits (puuid: string, matches: ITFTMatchModel[]) {
    const traits = algorithms.getTraits(puuid, matches)
    const response = {}
    for (const trait of traits) {
      const matchFilter = utils.FilterByTrait(trait, puuid, matches)
      const data = this.byQueue(puuid, matchFilter)
      _.set(response, trait, data)
    }
    return response
  }

  async updateSummoner ({ _id, puuid }: ISummonerModel) {
    const matchHistory = await this.tftRepository.find({
      participantsIds: _id
    })
    if (!Array.isArray(matchHistory)) {
      return
    }

    return {
      matches: matchHistory.length,
      byTraits: this.byTraits(puuid, matchHistory),
      byQueues: this.byQueue(puuid, matchHistory)
    }
  }
}
