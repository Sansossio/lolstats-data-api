import { Injectable } from '@nestjs/common'
import { ISummonerLeagueModel } from './models/summoner-leagues.interface'
import { ModelsName } from '../enums/database.enum'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RiotApiService } from '../riot-api/riot-api.service'
import { Regions } from 'twisted/dist/constants'
import * as utils from './summoner-leagues.utils'
import { Cache } from '../cache/cache.decorator'
import { CacheTimes } from '../enums/cache.enum'

@Injectable()
export class SummonerLeaguesService {
  private readonly api = this.riot.getLolApi().League

  constructor (
    @InjectModel(ModelsName.SUMMONER_LEAGUES) private readonly repository: Model<ISummonerLeagueModel>,

    private readonly riot: RiotApiService
  ) {}

  @Cache({
    expiration: CacheTimes.SUMMONER
  })
  async findOnRiot (id: string, region: Regions) {
    const {
      response: leagues
    } = await this.api.bySummoner(id, region)
    return utils.riotToModel(leagues)
  }

  async create (leagues: ISummonerLeagueModel | ISummonerLeagueModel[]) {
    return this.repository.create(leagues)
  }

  async findHistoric (summoner: string) {
    return this.repository.find({ summoner })
  }
}
