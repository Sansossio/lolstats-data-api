import { Injectable, NotFoundException } from '@nestjs/common'
import { Model, ModelUpdateOptions } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ModelsEnum } from '../database/database.enum'
import { ISummonerModel } from './models/summoner.interface'
import { GetSummonerQueryDTO } from './summoner.dto'
import { RiotApiService } from '../riot-api/riot-api.service'
import * as summonerMatch from './summoner.match'

@Injectable()
export class SummonerService {
  private readonly api = this.riot.getLolApi().Summoner

  constructor (
    @InjectModel(ModelsEnum.SUMMONER.name) private readonly repository: Model<ISummonerModel>,

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

  create () {
    return this.repository.create({})
  }

  async get (params: GetSummonerQueryDTO, findRiot: boolean = true) {
    const summoner = await this.repository.findOne({
      name: params.summonerName,
      region: params.region
    })
    if (summoner) {
      return summoner
    }
    if (!findRiot) {
      throw new NotFoundException('Summoner not found')
    }
    const onRiot = await this.findOnRiot(params)
    const model = summonerMatch.riotToModel(onRiot, params.region)
    await this.upsert(model)
    return this.get(params, false)
  }
}
