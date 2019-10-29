import { Injectable, NotFoundException, Inject } from '@nestjs/common'
import { RiotApiService } from '../riot-api/riot-api.service'
import { SummonerGetDTO } from './dto/summoner.dto'
import { SummonerEntity } from '../database/entities/entities/summoner.entity'
import { LeaguesService } from '../leagues/leagues.service'
import { ConfigService } from '../config/config.service'
import * as _ from 'lodash'
import * as summonerUtils from './summoner.utils'
import { MatchService } from '../match/match.service'
import Regions from '../enum/regions.enum'
import { MatchParticipantsIdentitiesPlayerDto, SummonerV4DTO, ApiResponseDTO } from 'api-riot-games/dist/dto'
import { FindOptions, Transaction } from 'sequelize/types'
import { RepositoriesName } from '../database/database.enum'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class SummonerService {
  private readonly api = this.riot.getLolApi()
  private readonly userUpdateInternal = this.configService.getNumber('update.userUpdateIntervalMin') * 60 * 1000

  constructor (
    @Inject(RepositoriesName.SUMMONER)
    private readonly repository: typeof SummonerEntity,

    private readonly databaseService: DatabaseService,
    private readonly riot: RiotApiService,
    private readonly leagueService: LeaguesService,
    private readonly configService: ConfigService,
    private readonly matchService: MatchService
  ) {}

  private async saveSummoner (instance: SummonerEntity | SummonerGetDTO, transaction?: Transaction): Promise<SummonerEntity> {
    const isParams = instance.hasOwnProperty('summonerName') && instance.hasOwnProperty('region')
    if (isParams) {
      const value = instance as SummonerGetDTO
      instance = await this.getSummonerInfo(value)
    }
    instance.accountId = instance.accountId || ''
    instance = instance as SummonerEntity
    return instance.save({ transaction })
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

  private async search (params: SummonerGetDTO, transaction?: Transaction) {
    let key = 'name'
    if (typeof params.accountId === 'string') {
      key = 'accountId'
    }
    const findOptions: FindOptions = {
      where: {
        bot: 0,
        region: params.region
      },
      include: ['leagues'],
      transaction
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

  private async upsert (base: SummonerEntity, params: SummonerGetDTO, transaction?: Transaction) {
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
    await this.repository.update(updateInstance, {
      where: {
        idSummoner: updateInstance.idSummoner
      },
      transaction
    })
    return this.get(params, false, transaction)
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

  async create (params: SummonerGetDTO, checkTime: boolean = true, transaction?: Transaction) {
    transaction = await this.databaseService.getTransaction(transaction)
    try {
      const exists = await this.search(params, transaction)
      let user: SummonerEntity
      // Upsert user
      if (!exists) {
        user = await this.saveSummoner(params, transaction)
      } else {
        if (checkTime) {
          this.checkSummonerCanUpdate(exists)
        }
        user = await this.upsert(exists, params, transaction)
      }
      // If isn't a bot, search info
      if (!summonerUtils.isBot(params.accountId)) {
        // User relations
        await this.matchService.updateMatches(user, transaction)
        // Remove loading
        if (user.loading) {
          await this.setUserLoaded(user, transaction)
        }
      }
      await transaction.commit()
      return user
    } catch (e) {
      await transaction.rollback()
      throw e
    }
  }

  async get (params: SummonerGetDTO, searchOnRiot: boolean = true, transaction?: Transaction): Promise<SummonerEntity> {
    // Search in database
    const search = await this.search(params, transaction)
    if (search) {
      return search
    }
    if (!searchOnRiot) {
      throw new NotFoundException()
    }
    return this.create(params, true, transaction)
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

  async setUserLoaded (instance: SummonerEntity, transaction?: Transaction) {
    instance.loading = false
    await instance.save({ transaction })
  }
}
