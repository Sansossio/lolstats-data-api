import { Injectable } from '@nestjs/common'
import { ISummonerLeagueModel } from './models/summoner-leagues.interface'
import { ModelsName } from '../database/database.enum'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SummonerLeagueDto } from 'api-riot-games/dist/dto'
import { castArray } from 'lodash'
import { RiotApiService } from '../riot-api/riot-api.service'
import { Regions } from 'api-riot-games/dist/constants'

@Injectable()
export class SummonerLeaguesService {
  private readonly api = this.riot.getApi().Lol.League

  constructor (
    @InjectModel(ModelsName.SUMMONER_LEAGUES) private readonly repository: Model<ISummonerLeagueModel>,

    private readonly riot: RiotApiService
  ) {}

  private riotToModel (summoner: string, leagues: SummonerLeagueDto | SummonerLeagueDto[]): Partial<ISummonerLeagueModel>[] {
    return castArray(leagues)
      .map((league) => ({
        ...league,
        summoner
      }))
  }

  async findOnRiot (id: string, region: Regions) {
    const {
      response: leagues
    } = await this.api.bySummoner(id, region)
    return leagues
  }

  async create (summoner: string, leagues: SummonerLeagueDto | SummonerLeagueDto[]) {
    const models = this.riotToModel(summoner, leagues)
    return this.repository.create(models)
  }
}
