import { Injectable } from '@nestjs/common'
import { RiotApiService } from '../riot-api/riot-api.service'
import { InjectRepository } from '@nestjs/typeorm'
import { SummonerLeagueContextEntity } from './entities/summoner-league.entity'
import { Repository } from 'typeorm'
import { DBConnection } from '../enum/database-connection.enum'
import { Regions } from 'api-riot-games/dist/constants'
import { SummonerLeagueDto } from 'api-riot-games/dist/dto'

const RomanNumerals = require('js-roman-numerals')

@Injectable()
export class LeaguesService {
  private readonly api = this.riot.getLolApi().league

  constructor (
    @InjectRepository(SummonerLeagueContextEntity, DBConnection.CONTEXT)
    private readonly repository: Repository<SummonerLeagueContextEntity>,
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

  async upsertLeagues (leagues: SummonerLeagueContextEntity[], idSummoner: number) {
    for (const league of leagues) {
      league.idSummoner = idSummoner
      const exists = await this.repository.findOne({
        where: {
          queueType: league.queueType,
          idSummoner: idSummoner
        }
      })
      if (exists) {
        const upsertInstance = Object.assign(league, exists)
        await this.repository.save(upsertInstance)
      } else {
        await this.repository.save(league)
      }
    }
  }

  async getBySummoner (encryptedSummonerId: string, region: Regions): Promise<(SummonerLeagueDto & { rank: number; })[]> {
    const {
      response: leagues
    } = await this.api.bySummoner(encryptedSummonerId, region)
    return this.mapRank(leagues)
  }
}
