import { Injectable, NotFoundException, NotAcceptableException, Inject } from '@nestjs/common'
import { RiotApiService } from '../riot-api/riot-api.service'
import { SummonerGetDTO } from './dto/summoner.dto'
import { SummonerEntity } from '../entities/entities/summoner.entity'
import { LeaguesService } from '../leagues/leagues.service'
import { ConfigService } from '../config/config.service'
import * as _ from 'lodash'
import * as summonerUtils from './summoner.utils'
import { MatchService } from '../match/match.service'
import Regions from '../enum/regions.enum'
import { MatchParticipantsIdentitiesPlayerDto, SummonerV4DTO, ApiResponseDTO } from 'api-riot-games/dist/dto'
import { RepositoriesName } from '../entities/repositories.enum'
import { FindOptions } from 'sequelize/types'

@Injectable()
export class SummonerService {
  private readonly api = this.riot.getLolApi()
  private readonly userUpdateInternal = this.configService.getNumber('update.userUpdateIntervalMin') * 60 * 1000
  private readonly userIsBannedTag = this.configService.get('summoners.banTag.accountId')

  constructor (
    @Inject(RepositoriesName.SUMMONER)
    private readonly repository: typeof SummonerEntity,
    private readonly riot: RiotApiService,
    private readonly leagueService: LeaguesService,
    private readonly configService: ConfigService,
    private readonly matchService: MatchService
  ) {}

  private async saveSummoner (instance: SummonerEntity | SummonerGetDTO): Promise<SummonerEntity> {
    const isParams = instance.hasOwnProperty('summonerName') && instance.hasOwnProperty('region')
    const region = instance.region
    if (isParams) {
      const value = instance as SummonerGetDTO
      instance = await this.getSummonerInfo(value)
    }
    instance.accountId = instance.accountId || ''
    instance = instance as SummonerEntity
    return instance.save()
  }

  private async getSummonerInfo (params: SummonerGetDTO): Promise<SummonerEntity> {
    let method = 'getByName'
    let value = params.summonerName
    if (typeof params.accountId === 'string') {
      method = 'getByAccountID'
      value = params.accountId
    }
    // Search summoner
    const {
      response: summoner
    } = await this.api.Summoner[method](value, params.region) as ApiResponseDTO<SummonerV4DTO>

    // Search summoner leagues
    const leagues = await this.leagueService.getBySummoner(summoner.id, params.region)

    return this.repository.build({
      ...summoner,
      region: params.region,
      leagues
    })
  }

  private async search (params: SummonerGetDTO) {
    let key = 'name'
    if (typeof params.accountId === 'string') {
      key = 'accountId'
    }
    const findOptions: FindOptions = {
      where: {
        bot: 0,
        region: params.region
      },
      include: ['leagues']
    }
    _.set(findOptions, `where.${key}`, params.accountId || params.summonerName)

    return this.repository.findOne(findOptions)
  }

  private checkSummonerCanUpdate (user: SummonerEntity) {
    const { updatedAt } = user
    const now = new Date().getTime()
    const lastUpdate = (updatedAt || new Date()).getTime()
    const interval = Math.abs(now - lastUpdate)
    const checkTime = interval > this.userUpdateInternal
    if (!checkTime) {
      // throw new NotAcceptableException()
    }
  }

  private async upsert (base: SummonerEntity, params: SummonerGetDTO) {
    const summoner = await this.getSummonerInfo(params)
    // Update existing user
    const baseUser = {
      leagues: undefined,
      // Force column updateAt
      revisionDate: (base.revisionDate || 0) + 1,
      // Keep user id
      idSummoner: base.idSummoner
    }
    const updateInstance = Object.assign(base, summoner, baseUser)
    await this.repository.update(updateInstance, { where: { idSummoner: updateInstance.idSummoner } })
    return this.get(params)
  }

  private async getOrCreateBot (player: MatchParticipantsIdentitiesPlayerDto, region: Regions) {
    const botInstance = summonerUtils.baseInstance({
      name: player.summonerName,
      bot: true,
      loading: false,
      region
    })
    return this.repository.create(botInstance)
  }

  async create (params: SummonerGetDTO, checkTime: boolean = true) {
    const exists = await this.search(params)
    let user: SummonerEntity
    // Upsert user
    if (!exists) {
      user = await this.saveSummoner(params)
    } else {
      if (checkTime) {
        this.checkSummonerCanUpdate(exists)
      }
      user = await this.upsert(exists, params)
    }
    // If isn't a bot, search info
    if (!summonerUtils.isBot(params.accountId)) {
      // User relations
      await this.matchService.updateMatches(user)
      // Remove loading
      if (user.loading) {
        await this.setUserLoaded(user)
      }
    }
    return user
  }

  async get (params: SummonerGetDTO, searchOnRiot: boolean = true): Promise<SummonerEntity> {
    // Search in database
    const search = await this.search(params)
    if (search) {
      return search
    }
    if (!searchOnRiot) {
      throw new NotFoundException()
    }
    return this.create(params)
  }

  async findByAccountId (accountId: string, region: Regions) {
    return this.api.Summoner.getByPUUID(accountId, region)
  }

  async exists (params: SummonerGetDTO): Promise<boolean> {
    return !!await this.search(params)
  }

  async getOrCreateByAccountID (player: MatchParticipantsIdentitiesPlayerDto, region: Regions) {
    const {
      summonerName,
      currentAccountId,
      profileIcon
    } = player
    // Use generic instance for bots
    const isBot = summonerUtils.isBot(currentAccountId)
    if (isBot) {
      return this.getOrCreateBot(player, region)
    }
    // Find existing instance
    const find = await this.repository.findOne({
      where: {
        accountId: currentAccountId,
        region
      }
    })
    if (find) {
      return find
    }
    // Create new partial instance
    const accountId = summonerUtils.parseAccountId(currentAccountId)
    const instance: SummonerEntity = summonerUtils.baseInstance({
      name: summonerName,
      profileIconId: profileIcon,
      accountId,
      region
    })
    return this.repository.create(instance)
  }

  async setUserLoaded (instance: SummonerEntity) {
    instance.loading = false
    await instance.save()
  }
}
