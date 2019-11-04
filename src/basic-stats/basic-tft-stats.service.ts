import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ModelsName } from '../enums/database.enum'
import { ISummonerModel } from '../summoner/models/summoner.interface'
import { Model } from 'mongoose'
import { ITFTMatchModel } from '../tft-match/models/match/tft-match.interface'
import * as utils from './basic-stats.utils'

@Injectable()
export class BasicTftStatsService {
  constructor (
    // Database
    @InjectModel(ModelsName.SUMMONER) private readonly summonersRepository: Model<ISummonerModel>,

    @InjectModel(ModelsName.TFT_MATCH) private readonly tftRepository: Model<ITFTMatchModel>
  ) {}

  async updateSummoner ({ _id, puuid }: ISummonerModel) {
    const matchHistory = await this.tftRepository.find({
      participantsIds: _id
    })
    if (!Array.isArray(matchHistory)) {
      return
    }

    return {
      globalAverage: {
        goldLeft: utils.goldLeftAverage(puuid, matchHistory),
        level: utils.levelAverage(puuid, matchHistory),
        lastRound: utils.lastRoundAverage(puuid, matchHistory)
      },
      global: {
        playersEliminated: utils.playersElimited(puuid, matchHistory),
        winrate: utils.winrate(puuid, matchHistory)
      },
      perQueue: {
        winrate: utils.winRatePerQueue(puuid, matchHistory)
      },
      mostUsed: {
        traits: utils.mostUnits(puuid, matchHistory),
        units: utils.mostTraitsUsed(puuid, matchHistory)
      }
    }
  }
}
