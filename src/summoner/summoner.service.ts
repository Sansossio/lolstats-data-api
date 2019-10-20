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

@Injectable()
export class SummonerService {
  private readonly api = this.riot.getLolApi().summoner
  private readonly userUpdateInternal = this.configService.getNumber('update.userUpdateIntervalMin') * 60 * 1000

  constructor (
    @InjectRepository(SummonerContextEntity, DBConnection.CONTEXT)
    private readonly repository: Repository<SummonerContextEntity>,
    private readonly riot: RiotApiService,
    private readonly leagueService: LeaguesService,
    private readonly configService: ConfigService
  ) {}

  private async saveSummoner (instance: SummonerContextEntity | SummonerGetDTO, onlyInstance: boolean = false): Promise<SummonerContextEntity> {
    const isParams = instance.hasOwnProperty('summonerName') && instance.hasOwnProperty('region')
    const region = instance.region
    if (isParams) {
      const value = instance as SummonerGetDTO
      instance = await this.getSummonerInfo(value)
    }
    instance = instance as SummonerContextEntity
    // Search id in database
    const previous = await this.repository.findOne({
      where: {
        id: instance.id,
        region
      }
    })
    // Remove relational data
    if (previous || onlyInstance) {
      delete instance.leagues
    }
    const upsertInstance = this.repository.create({
      ...instance,
      idSummoner: _.get(previous, 'idSummoner', instance.idSummoner)
    })
    return this.repository.save(upsertInstance)
  }

  private async getSummonerInfo (params: SummonerGetDTO): Promise<SummonerContextEntity> {
    // Search summoner
    const {
      response: summoner
    } = await this.api.getByName(params.summonerName, params.region)
    // Search summoner leagues
    const leagues = await this.leagueService.getBySummoner(summoner.id, params.region)

    const response = this.repository.create({
      ...summoner,
      region: params.region,
      leagues
    })

    return response
  }

  private updateIntervalCheck (updateAt: Date): boolean {
    const now = new Date().getTime()
    const lastUpdate = updateAt.getTime()
    const interval = Math.abs(now - lastUpdate)
    return interval > this.userUpdateInternal
  }

  private async search (params: SummonerGetDTO) {
    return this.repository.createQueryBuilder('summoners')
      .leftJoinAndSelect('summoners.leagues', 'summoner_leagues')
      .where('LOWER(name) = LOWER(:name)', { name: params.summonerName })
      .andWhere('region = :region', { region: params.region })
      .getOne()
  }

  private async upsert (base: SummonerContextEntity, params: SummonerGetDTO) {
    // Check time
    const checkTime = this.updateIntervalCheck(base.updateAt)
    if (!checkTime) {
      throw new NotAcceptableException()
    }
    const summoner = await this.getSummonerInfo(params)
    // Update existing user
    const baseUser = {
      leagues: undefined,
      // Force column updateAt
      revisionDate: base.revisionDate + 1
    }
    const updateInstance = Object.assign(base, summoner, baseUser)
    const { idSummoner } = await this.saveSummoner(updateInstance, true)
    await this.leagueService.upsertLeagues(summoner.leagues, idSummoner)
    return this.get(params)
  }

  async update (params: SummonerGetDTO) {
    const exists = await this.search(params)
    if (!exists) {
      await this.saveSummoner(params)
      return this.get(params, false)
    }
    return this.upsert(exists, params)
  }

  async get (params: SummonerGetDTO, searchOnRiot: boolean = true): Promise<SummonerContextEntity> {
    // Search in database
    const search = await this.search(params)
    if (search) {
      return search
    }
    // Search in riot api
    try {
      if (!searchOnRiot) {
        throw new NotFoundException()
      }
      const userInfo = await this.getSummonerInfo(params)
      await this.saveSummoner(userInfo)
      return await this.get(params, false)
    } catch (e) {
      throw new NotFoundException()
    }
  }
}
