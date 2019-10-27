import { Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common'
import { RiotApiService } from '../riot-api/riot-api.service'
import { SummonerGetDTO } from './dto/summoner.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { SummonerContextEntity } from './summoner.entity'
import { Repository } from 'typeorm'
import { LeaguesService } from '../leagues/leagues.service'
import { DBConnection } from '../enum/database-connection.enum'
import { ConfigService } from '../config/config.service'
import * as _ from 'lodash'
import * as summonerUtils from './summoner.utils'
import { MatchService } from '../match/match.service'
import Regions from '../enum/regions.enum'
import { MatchParticipantsIdentitiesPlayerDto } from 'api-riot-games/dist/dto'
import { SummonerV4DTO } from '../../../riot-games-api/src/dto/Summoner/Summoner.dto'

@Injectable()
export class SummonerService {
  private readonly api = this.riot.getLolApi()
  private readonly userUpdateInternal = this.configService.getNumber('update.userUpdateIntervalMin') * 60 * 1000
  private readonly userIsBannedTag = this.configService.get('summoners.banTag.accountId')

  constructor (
    @InjectRepository(SummonerContextEntity, DBConnection.CONTEXT)
    private readonly repository: Repository<SummonerContextEntity>,
    private readonly riot: RiotApiService,
    private readonly leagueService: LeaguesService,
    private readonly configService: ConfigService,
    private readonly matchService: MatchService
  ) {}

  private async saveSummoner (instance: SummonerContextEntity | SummonerGetDTO, onlyInstance: boolean = false): Promise<SummonerContextEntity> {
    const isParams = instance.hasOwnProperty('summonerName') && instance.hasOwnProperty('region')
    const region = instance.region
    if (isParams) {
      const value = instance as SummonerGetDTO
      instance = await this.getSummonerInfo(value)
    }
    instance.accountId = instance.accountId || ''
    instance = instance as SummonerContextEntity
    // Search id in database
    const previous = await this.repository.findOne({
      where: {
        accountId: instance.accountId,
        region
      }
    })
    // Remove relational data
    if (previous || onlyInstance) {
      delete instance.leagues
    }
    const upsertInstance = this.repository.create({
      ...instance,
      idSummoner: _.get(previous, 'idSummoner', instance.idSummoner),
      loading: false
    })
    return this.repository.save(upsertInstance)
  }

  private async getSummonerInfo (params: SummonerGetDTO): Promise<SummonerContextEntity> {
    let method = 'getByName'
    let value = params.summonerName
    if (typeof params.accountId === 'string') {
      method = 'getByAccountID'
      value = params.accountId
    }
    // Search summoner
    const {
      response: summoner
    } = await this.api.Summoner[method](value, params.region)
    // Search summoner leagues
    const leagues = await this.leagueService.getBySummoner(summoner.id, params.region)

    const response = this.repository.create({
      ...summoner as SummonerV4DTO,
      region: params.region,
      leagues
    })

    return response
  }

  private async search (params: SummonerGetDTO) {
    let key = 'LOWER(name)'
    let value = 'LOWER(:value)'
    if (typeof params.accountId === 'string') {
      key = 'accountId'
      value = ':value'
    }
    const whereString = `${key} = ${value} AND accountId is not null`
    return this.repository.createQueryBuilder('summoners')
      .leftJoinAndSelect('summoners.leagues', 'summoner_leagues')
      .where(whereString, { value: params.accountId || params.summonerName })
      .andWhere('region = :region', { region: params.region })
      .getOne()
  }

  private checkSummonerCanUpdate (user: SummonerContextEntity) {
    const { updateAt } = user
    const now = new Date().getTime()
    const lastUpdate = (updateAt || new Date()).getTime()
    const interval = Math.abs(now - lastUpdate)
    const checkTime = interval > this.userUpdateInternal
    if (!checkTime) {
      throw new NotAcceptableException()
    }
  }

  private async upsert (base: SummonerContextEntity, params: SummonerGetDTO) {
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
    const { idSummoner } = await this.saveSummoner(updateInstance, true)
    await this.leagueService.upsertLeagues(summoner.leagues, idSummoner)
    return this.get(params)
  }

  async create (params: SummonerGetDTO, checkTime: boolean = true) {
    const exists = await this.search(params)
    let user: SummonerContextEntity
    if (!exists) {
      await this.saveSummoner(params)
      user = await this.get(params, false)
    } else {
      if (checkTime) {
        this.checkSummonerCanUpdate(exists)
      }
      user = await this.upsert(exists, params)
    }
    if (!summonerUtils.isBot(params.accountId)) {
      await this.matchService.updateMatches(user.idSummoner, true)
    }
    return user
  }

  async get (params: SummonerGetDTO, searchOnRiot: boolean = true): Promise<SummonerContextEntity> {
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
    const searchUserByID = !summonerUtils.isBot(currentAccountId)
    const findTag = searchUserByID ? 'accountId' : 'name'
    const findValue = searchUserByID ? currentAccountId : summonerName
    const findOptions = {
      where: {
        region
      }
    }
    _.set(findOptions, `where.${findTag}`, findValue)
    const find = await this.repository.findOne(findOptions)
    if (find) {
      return find
    }
    const accountId = summonerUtils.parseAccountId(currentAccountId)
    const instance: SummonerContextEntity = {
      idSummoner: 0,
      accountId,
      leagues: [],
      name: summonerName,
      profileIconId: profileIcon,
      loading: !!accountId,
      region
    }
    return this.repository.save(instance)
  }
}
