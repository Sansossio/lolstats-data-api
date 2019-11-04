import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ModelsName } from '../enums/database.enum'
import { ISummonerModel } from '../summoner/models/summoner.interface'
import { Model } from 'mongoose'
import { ITFTMatchModel } from '../tft-match/models/match/tft-match.interface'
import * as utils from './basic-stats.utils'
import { TftMatchEnum } from '../enums/tft-match.enum'
import * as _ from 'lodash'

@Injectable()
export class BasicTftStatsService {
  constructor (
    // Database
    @InjectModel(ModelsName.SUMMONER) private readonly summonersRepository: Model<ISummonerModel>,

    @InjectModel(ModelsName.TFT_MATCH) private readonly tftRepository: Model<ITFTMatchModel>
  ) {}

  private objectResponse (puuid: string, matches: ITFTMatchModel[]) {
    return {
      averages: {
        goldLeft: utils.goldLeftAverage(puuid, matches),
        level: utils.levelAverage(puuid, matches),
        lastRound: utils.lastRoundAverage(puuid, matches)
      },
      global: {
        playersEliminated: utils.playersElimited(puuid, matches),
        winrate: utils.winrate(puuid, matches)
      },
      mostUsed: {
        traits: utils.mostUnits(puuid, matches),
        units: utils.mostTraitsUsed(puuid, matches)
      }
    }
  }

  async updateSummoner ({ _id, puuid }: ISummonerModel) {
    const matchHistory = await this.tftRepository.find({
      participantsIds: _id
    })
    if (!Array.isArray(matchHistory)) {
      return
    }

    const queues = utils.getQueues(matchHistory)
    const response = {}
    
    for (const queue of queues) {
      let data = {}
      let key = queue
      // All queues
      if (queue === TftMatchEnum.STATS_GLOBAL) {
        data = this.objectResponse(puuid, matchHistory)
      } else {
        // Filter by queueId
        const matchesFiltered = matchHistory.filter(match => match.queue.queueId === +queue)
        data = this.objectResponse(puuid, matchesFiltered)
      }

      _.set(response, key, data)
    }

    return response
  }
}
