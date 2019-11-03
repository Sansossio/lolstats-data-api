import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ModelsName } from '../enums/database.enum'
import { ISummonerModel } from '../summoner/models/summoner.interface'
import { Model } from 'mongoose'
import { ITFTMatchModel } from '../tft-match/models/match/tft-match.interface'
import * as _ from 'lodash'
import { calculateWinRate, findSummoner } from './basic-stats.utils'

@Injectable()
export class BasicTftStatsService {
  constructor (
    // Database
    @InjectModel(ModelsName.SUMMONER) private readonly summonersRepository: Model<ISummonerModel>,

    @InjectModel(ModelsName.TFT_MATCH) private readonly tftRepository: Model<ITFTMatchModel>
  ) {}

  private winRatePerQueue (puuid: string, matches: ITFTMatchModel[]) {
    const queues = matches.reduce<number[]>((prev, curr) => {
      const {
        queue: {
          queueId
        }
      } = curr
      if (queueId && prev.indexOf(queueId) === -1) {
        prev.push(queueId)
      }
      return prev
    }, [])
    const perQueue = queues.map((queue) => {
      const filterMatches = matches.filter(m => m.queue.queueId === queue)
      const winrate = calculateWinRate(puuid, filterMatches)
      return {
        queue,
        winrate
      }
    })
    return perQueue
  }

  private mostTraitsUsed (puuid: string, matches: ITFTMatchModel[]) {
    const response: { name: string, num_units: number }[] = []
    for (const match of matches) {
      // Find traits
      const { traits } = findSummoner(puuid, match.participants)
      if (!traits) {
        throw new Error('Invalid model')
      }
      // Iterate over traits
      for (const trait of traits) {
        const { name = '', num_units = 0 } = trait
        const findIndex = response.findIndex(r => r.name === name)
        // Upsert
        if (findIndex !== -1) {
          response[findIndex].num_units += num_units
        } else {
          response.push({
            name,
            num_units
          })
        }
      }
    }

    return _.orderBy(response, v => -v.num_units)
  }

  private globalWinRate (puuid: string, matches: ITFTMatchModel[]): number {
    return calculateWinRate(puuid, matches)
  }

  async updateSummoner ({ _id, puuid }: ISummonerModel) {
    const matchHistory = await this.tftRepository.find({
      participantsIds: _id
    })
    if (!Array.isArray(matchHistory)) {
      return
    }
    const globalWinrate = this.globalWinRate(puuid, matchHistory)
    const perQueueWinrate = this.winRatePerQueue(puuid, matchHistory)
    const mostTraits = this.mostTraitsUsed(puuid, matchHistory)

    return {
      globalWinrate,
      perQueueWinrate,
      mostTraits
    }
  }
}
