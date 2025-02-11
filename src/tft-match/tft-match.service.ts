import { Injectable, BadGatewayException } from '@nestjs/common'
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
import { CacheTimes } from '../enums/cache.enum'
import { UpdateSummonerTFTMatchDTO } from './dto/update-summoner.tft-match.dto'
import { TotalTFTMatchesDTO } from './dto/total.tft-match.dto'

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
  private async matchSummoners (currentPuuid: string, puuids: string[], region: Regions): Promise<ISummonerModel[]> {
    const response: ISummonerModel[] = []
    const findOnRiot = true
    for (const puuid of puuids) {
      const userLoading = puuid !== currentPuuid
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

  @Cache({
    expiration: CacheTimes.TFT_MATCH_DETAILS
  })
  private async getMatch (match_id: string, region: TftRegions) {
    const {
      response: match
    } = await this.api.get(match_id, region)
    return match
  }

  private async createMatch (puuid: string, match_id: string, region: Regions) {
    const parseRegion = regionToTftRegions(region)
    const match = await this.getMatch(match_id, parseRegion)
    // Match users
    const users = await this.matchSummoners(puuid, match.metadata.participants, region)
    const queue = await this.staticService.getQueue(match.info.queue_id)
    const items = await this.staticService.getTftitems()
    const model = tftMatchUtils.riotToModel(match, region, users, queue, items)
    if (!model.match_id) {
      throw new BadGatewayException('Invalid match id')
    }
    // Create game
    const condition = {
      match_id: model.match_id,
      region: model.region
    }
    const options = {
      upsert: true
    }
    const instance = await this.repository.updateOne(condition, model, options)
    // Push game into users
    const usersIds = users.map(u => u._id)
    await this.summonerService.insertMatches(
      usersIds,
      model.match_id,
      SummonerServiceInsertMatch.TFT
    )

    return instance
  }

  @Cache({
    expiration: CacheTimes.TFT_MATCH_LISTING
  })
  private async getMatchListing (puuid: string, region: TftRegions) {
    const {
      response: matchIds
    } = await this.api.list(puuid, region)
    return matchIds
  }

  // Public methods
  async updateSummoner (params: GetSummonerQueryDTO): Promise<UpdateSummonerTFTMatchDTO> {
    const parseRegion = regionToTftRegions(params.region)
    // Summoner details
    const { puuid } = await this.summonerService.get(params)
    // Create matches
    await Promise.map(
      this.getMatchListing(puuid, parseRegion),
      match => this.createMatch(puuid, match, params.region),
      { concurrency: this.concurrency }
    )
    // Response
    return { msg: 'OK' }
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

  async total (): Promise<TotalTFTMatchesDTO> {
    const matches = await this.repository.find()
    const size = JSON.stringify(matches).length
    return {
      count: matches.length,
      size
    }
  }
}
