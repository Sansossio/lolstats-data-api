import { Injectable, Inject } from '@nestjs/common'
import { RiotApiService } from '../riot-api/riot-api.service'
import { SummonerLeagueEntity } from '../database/entities/entities/summoner-league.entity'
import { Regions } from 'api-riot-games/dist/constants'
import { SummonerLeagueDto } from 'api-riot-games/dist/dto'
import { RepositoriesName } from '../database/database.enum'

const RomanNumerals = require('js-roman-numerals')

@Injectable()
export class LeaguesService {
  private readonly api = this.riot.getLolApi()

  constructor (
    @Inject(RepositoriesName.SUMMONER_LEAGUE)
    private readonly repository: typeof SummonerLeagueEntity,
    private readonly riot: RiotApiService
  ) {}

  private romanToInt (roman: string): number {
    return +new RomanNumerals(roman).toInt()
  }

  private mapRank (data: SummonerLeagueDto[]) {
    return data.map(league => this.repository.build({
      ...league,
      rank: this.romanToInt(league.rank)
    }))
  }

  async upsertLeagues (leagues: SummonerLeagueEntity[], summonerId: number) {
    for (const league of leagues) {
      league.summonerId = summonerId
      const exists = await this.repository.findOne({
        where: {
          queueType: league.queueType,
          summonerId
        }
      })
      if (exists) {
        const upsertInstance = Object.assign(league, exists)
        await upsertInstance.save()
      } else {
        await this.repository.create(league)
      }
    }
  }

  async getBySummoner (encryptedSummonerId: string, region: Regions) {
    const {
      response: leagues
    } = await this.api.League.bySummoner(encryptedSummonerId, region)
    return this.mapRank(leagues)
  }

  async create (leagues: SummonerLeagueEntity[]) {
    for (const league of leagues) {
      await league.save()
    }
  }
}
