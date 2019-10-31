import { Injectable, NotFoundException } from '@nestjs/common'
import { Model, ModelUpdateOptions } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ModelsName } from '../database/database.enum'
import { ISummonerModel } from './models/summoner.interface'
import { GetSummonerQueryDTO } from './models/summoner.dto'
import { RiotApiService } from '../riot-api/riot-api.service'
import * as summonerUtils from './summoner.utils'
import * as _ from 'lodash'
import { SummonerLeaguesService } from '../summoner-leagues/summoner-leagues.service'
import { SummonerV4DTO } from 'api-riot-games/dist/dto'

@Injectable()
export class SummonerService {
  private readonly api = this.riot.getLolApi().Summoner

  constructor (
    @InjectModel(ModelsName.SUMMONER) private readonly repository: Model<ISummonerModel>,

    private readonly summonerLeagueService: SummonerLeaguesService,
    private readonly riot: RiotApiService
  ) {}

  private async findOnRiot (params: GetSummonerQueryDTO) {
    const {
      region,
      summonerName,
      summonerPUUID
    } = params
    let summoner: SummonerV4DTO
    // Find by puuid or summoner name
    if (summonerPUUID) {
      ({ response: summoner } =
        await this.api.getByPUUID(summonerPUUID, region))
    } else {
      ({ response: summoner } =
        await this.api.getByName(summonerName, region))
    }

    return summoner
  }

  private async upsert (model: Partial<ISummonerModel>) {
    delete model._id
    const condition = {
      accountId: model.accountId,
      region: model.region
    }
    const options: ModelUpdateOptions = {
      upsert: true
    }
    return this.repository.updateOne(condition, model, options)
  }

  // Public methods
  async update (params: GetSummonerQueryDTO) {
    const onRiot = await this.findOnRiot(params)
    const leagues = await this.summonerLeagueService.findOnRiot(onRiot.id, params.region)
    const model = summonerUtils.riotToModel(onRiot, leagues, params.region)
    await this.upsert(model)
    const response = await this.get(
      {
        summonerName: onRiot.name,
        region: params.region
      }
      , false)
    if (!response) {
      throw new Error()
    }
    // Update based users models
    await this.summonerLeagueService.create(response._id, leagues)
    return response
  }

  async get (params: GetSummonerQueryDTO, findRiot: boolean = true) {
    // Find by name or puuid
    const options = {
      // Case insensitive
      name: new RegExp(params.summonerName, 'i'),
      region: params.region
    }
    if (params.summonerPUUID) {
      delete options.name
      _.set(options, 'puuid', params.summonerPUUID)
    }

    const summoner = await this.repository.findOne(options)
    if (summoner) {
      return summoner
    }
    if (!findRiot) {
      throw new NotFoundException('Summoner not found')
    }
    return this.update(params)
  }

  // External methods
  async leaguesHistoric (params: GetSummonerQueryDTO) {
    const summoner = await this.get(params)
    return this.summonerLeagueService.findHistoric(summoner._id)
  }
}
