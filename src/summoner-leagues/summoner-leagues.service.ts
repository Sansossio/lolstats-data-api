import { Injectable } from '@nestjs/common'
import { ISummonerLeagueModel } from './models/summoner-leagues.interface'
import { ModelsName } from '../database/database.enum'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SummonerLeagueDto } from 'twisted/dist/dto'
import { castArray } from 'lodash'
import { RiotApiService } from '../riot-api/riot-api.service'
import { Regions } from 'twisted/dist/constants'
import * as utils from './summoner-leagues.utils'

@Injectable()
export class SummonerLeaguesService {
  private readonly api = this.riot.getLolApi().League

  constructor (
    @InjectModel(ModelsName.SUMMONER_LEAGUES) private readonly repository: Model<ISummonerLeagueModel>,

    private readonly riot: RiotApiService
  ) {}

  private riotToModel (leagues: SummonerLeagueDto | SummonerLeagueDto[], summoner?: string): ISummonerLeagueModel[] {
    const response: ISummonerLeagueModel[] = []
    for (const item of castArray(leagues)) {
      const createItem = {
        ...item,
        rank: utils.romanToInt(item.rank),
        summoner: summoner
      }
      response.push(createItem as ISummonerLeagueModel)
    }
    return response
  }

  async findOnRiot (id: string, region: Regions) {
    const {
      response: leagues
    } = await this.api.bySummoner(id, region)
    return this.riotToModel(leagues)
  }

  async create (summoner: string, leagues: ISummonerLeagueModel | ISummonerLeagueModel[]) {
    return this.repository.create(leagues)
  }

  async findHistoric (summoner: string) {
    return this.repository.find({ summoner })
  }
}
