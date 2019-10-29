import { Injectable, Inject, BadGatewayException } from '@nestjs/common'
import { RiotApiService } from '../riot-api/riot-api.service'
import { SummonerLeagueEntity } from '../database/entities/entities/summoner-league.entity'
import { SummonerLeagueDto } from 'api-riot-games/dist/dto'
import { RepositoriesName } from '../database/database.enum'
import { SummonerEntity } from '../database/entities/entities/summoner.entity'
import { Transaction } from 'sequelize/types'
import * as leaguesUtils from './leagues.utils'

@Injectable()
export class LeaguesService {
  private readonly api = this.riot.getLolApi()

  constructor (
    @Inject(RepositoriesName.SUMMONER_LEAGUE)
    private readonly repository: typeof SummonerLeagueEntity,

    private readonly riot: RiotApiService
  ) {}

  private mapRank (data: SummonerLeagueDto[]) {
    return data.map(league => this.repository.build({
      ...league,
      rank: leaguesUtils.romanToInt(league.rank)
    }))
  }

  async upsertLeagues (summoner: SummonerEntity, transaction?: Transaction) {
    if (!summoner) {
      throw new BadGatewayException('Bad summoner')
    }
    const {
      idSummoner: summonerId,
      id,
      region
    } = summoner
    const {
      response: leagues
    } = await this.api.League.bySummoner(id, region)
    const matchLeagues = this.mapRank(leagues)
    for (const plainLeague of matchLeagues) {
      let league = Object.assign(
        plainLeague,
        { summonerId }
      )
      const exists = await this.repository.findOne({
        where: {
          queueType: league.queueType,
          summonerId
        },
        transaction
      })
      // Merge if exists
      league = Object.assign(league, exists || {})
      await league.save({ transaction })
    }
  }
}
