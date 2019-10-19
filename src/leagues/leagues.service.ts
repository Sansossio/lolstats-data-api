import { Injectable } from '@nestjs/common'
import { RiotApiService } from '../riot-api/riot-api.service'
import { Regions } from 'api-riot-games/dist/constants'
import * as RomanNumerals from 'js-roman-numerals'

@Injectable()
export class LeaguesService {
  private readonly api = this.riot.getLolApi().league

  constructor (
    private readonly riot: RiotApiService
  ) {}

  private romanToInt (roman: string): number {
    return +new RomanNumerals(roman).toInt()
  }

  private mapRank<T extends { rank: string }> (data: T[]): (T & { rank: number })[] {
    return data.map(league => ({
      ...league,
      rank: this.romanToInt(league.rank)
    }))
  }

  async bySummoner (encryptedSummonerId: string, region: Regions) {
    const {
      response: leagues
    } = await this.api.bySummoner(encryptedSummonerId, region)
    return this.mapRank(leagues)
  }
}
