import { Injectable } from '@nestjs/common'
import { RiotApiService } from '../riot-api/riot-api.service'
import Regions from 'lolstats-common/src/enum/riot/regions.riot.enum'
import * as RomanNumerals from 'js-roman-numerals'
import { SummonerLeagueDto } from 'lolstats-common/src/modules/riot/dto'

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

  async bySummoner (encryptedSummonerId: string, region: Regions): Promise<(SummonerLeagueDto & { rank: number; })[]> {
    const {
      response: leagues
    } = await this.api.bySummoner(encryptedSummonerId, region)
    return this.mapRank(leagues)
  }
}
