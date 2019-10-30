import { Injectable, NotFoundException } from '@nestjs/common'
import { Model, ModelUpdateOptions } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ModelsName } from '../database/database.enum'
import { ISummonerModel } from './models/summoner.interface'
import { GetSummonerQueryDTO } from './summoner.dto'
import { RiotApiService } from '../riot-api/riot-api.service'
import * as summonerMatch from './summoner.match'
import { SummonerLeaguesService } from '../summoner-leagues/summoner-leagues.service'

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
      response: summoner
    } = await this.api.getByName(params.summonerName, params.region)
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
    const model = summonerMatch.riotToModel(onRiot, leagues, params.region)
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
    const summoner = await this.repository.findOne({
      // Case insensitive
      name: new RegExp(params.summonerName, 'i'),
      region: params.region
    })
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
