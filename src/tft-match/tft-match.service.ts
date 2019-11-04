import { Injectable } from '@nestjs/common'
import { ITFTMatchModel } from './models/match/tft-match.interface'
import { ModelsName } from '../enums/database.enum'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Promise } from 'bluebird'
import { Regions, regionToTftRegions, TftRegions } from 'twisted/dist/constants'
import { RiotApiService } from '../riot-api/riot-api.service'
import { SummonerService, SummonerServiceInsertMatch } from '../summoner/summoner.service'
import { GetSummonerQueryDTO } from '../summoner/models/summoner.dto'
import { ISummonerModel } from '../summoner/models/summoner.interface'
import * as tftMatchUtils from './tft-match.utils'
import * as _ from 'lodash'
import { ConfigService } from '../config/config.service'
import { StaticDataService } from '../static-data/static-data.service'
import { QueryTftMatches } from './dto/query.tft-match.dto'
import { Cache } from '../cache/cache.decorator'

@Injectable()
export class TftMatchService {
  private readonly api = this.riot.getTftApi().Match
  private readonly concurrency = this.config.getNumber('concurrency.tft_matches')

  constructor (
    @InjectModel(ModelsName.TFT_MATCH) private readonly repository: Model<ITFTMatchModel>,

    private readonly config: ConfigService,
    private readonly summonerService: SummonerService,
    private readonly staticService: StaticDataService,
    private readonly riot: RiotApiService
  ) {}

  // Internal methods
  private async matchSummoners (puuids: string[], region: Regions): Promise<ISummonerModel[]> {
    const response: ISummonerModel[] = []
    const userLoading = true
    const findOnRiot = true
    for (const puuid of puuids) {
      const params = {
        summonerName: '',
        summonerPUUID: puuid,
        region
      }
      // Create user as "loading"
      const summoner = await this.summonerService.get(params, findOnRiot, userLoading)
      response.push(summoner)
    }
    return response
  }

  private async createMatch (match_id: string, region: Regions) {
    const parseRegion = regionToTftRegions(region)
    // Not recreate
    const exists = await this.repository.findOne({ match_id, region })
    if (exists) {
      return exists
    }
    const {
      response: match
    } = await this.api.get(match_id, parseRegion)
    // Match users
    const users = await this.matchSummoners(match.metadata.participants, region)
    const queue = await this.staticService.getQueues(match.info.queue_id)
    const items = await this.staticService.getTftitems()
    const model = tftMatchUtils.riotToModel(match, region, users, queue, items)
    // Create game
    const instance = await this.repository.create(model)
    // Push game into users
    const usersIds = users.map(u => u._id)
    await this.summonerService.insertMatches(usersIds, instance.match_id, SummonerServiceInsertMatch.TFT)

    return instance
  }

  private async getMatchListing (puuid: string, region: TftRegions) {
    const {
      response: matchIds
    } = await this.api.list(puuid, region)
    return matchIds
  }

  // Public methods
  async updateSummoner (params: GetSummonerQueryDTO) {
    const parseRegion = regionToTftRegions(params.region)
    // Summoner details
    const { puuid } = await this.summonerService.get(params)
    // Listing by user
    const matchIds = this.getMatchListing(puuid, parseRegion)
    // Get all models
    const models = await Promise.map(
      matchIds,
      match => this.createMatch(match, params.region),
      { concurrency: this.concurrency }
    )
    // Response
    return models
  }

  async getBySummoner (params: QueryTftMatches) {
    // Search params
    const { _id } = await this.summonerService.get(params)
    const {
      condition,
      skip,
      sort,
      requestLimit
    } = tftMatchUtils.getSearchParams(params, _id)

    const count = await this.repository.countDocuments(condition)
    const baseObjectResponse = {
      page: params.page,
      limit: params.limit,
      total: count,
      data: []
    }

    // Page results isn't greater than total results
    const roundCount = Math.ceil(count / params.limit) * params.limit
    if (roundCount >= requestLimit) {
      const data = await this.repository.find(condition)
        .limit(params.limit)
        .skip(skip)
        .sort(sort)

      return {
        ...baseObjectResponse,
        data
      }
    }
    return baseObjectResponse
  }
}
