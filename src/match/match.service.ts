import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DBConnection } from '../enum/database-connection.enum'
import { Repository, getManager, FindOneOptions, FindManyOptions } from 'typeorm'
import { RiotApiService } from '../riot-api/riot-api.service'
import { MatchEntity } from './entities/match.entity'
import { SummonerContextEntity } from '../summoner/summoner.entity'
import { sortBy, cloneDeep, set, merge } from 'lodash'
import { MatchesFindParams } from './dto/summoner-matches.dto'
import { MatchQueryDTO } from 'api-riot-games/dist/dto'
import { MatchListingMatches } from '../../../riot-games-api/src/dto/Match/MatchListing/MatchListingMatches.dto'
import { Regions } from 'api-riot-games/dist/constants'
import { MatchParticipantsEntity } from './entities/match.participants.entity'
import { SummonerGetDTO } from '../summoner/dto/summoner.dto'

const findLimit = 100

@Injectable()
export class MatchService {
  private readonly api = this.riot.getLolApi()

  constructor (
    @InjectRepository(MatchEntity, DBConnection.CONTEXT)
    private readonly repository: Repository<MatchEntity>,
    @InjectRepository(MatchParticipantsEntity, DBConnection.CONTEXT)
    private readonly participantsRepository: Repository<MatchParticipantsEntity>,
    @InjectRepository(SummonerContextEntity, DBConnection.CONTEXT)
    private readonly summonerRepository: Repository<SummonerContextEntity>,

    private readonly riot: RiotApiService
  ) {}

  private async getSummoner (find: number | string, region: Regions): Promise<SummonerContextEntity> {
    const key = typeof find === 'string' ? 'accountId' : 'idSummoner'
    const options: FindOneOptions = {
      where: {
        region
      }
    }
    set(options, `where.${key}`, find)
    try {
      return await this.summonerRepository.findOneOrFail(options)
    } catch (e) {
      throw new NotFoundException('User not found')
    }
  }

  private async save (instances: MatchEntity[]) {
    const dupEntryError = 'ER_DUP_ENTRY'
    await getManager(DBConnection.CONTEXT).transaction(async param => {
      for (const instance of instances) {
        try {
          await param.save(instance)
        } catch (e) {
          // Ignore when is duplicated entry
          if (e.code !== dupEntryError) {
            throw e
          }
        }
      }
    })
  }

  private match (matches: MatchListingMatches[], summoner: number, region: Regions): MatchEntity[] {
    const matchParticipants = [
      this.participantsRepository.create({
        summoner
      })
    ]
    return matches.map<MatchEntity>(match => this.repository.create({
      gameCreation: new Date(match.timestamp),
      gameId: match.gameId,
      queue: match.queue,
      season: match.season,
      matchParticipants,
      region
    }))
  }

  private async loadMatches (value: number | string, region: Regions, params: MatchesFindParams = {}) {
    const {
      endIndex = findLimit,
      beginIndex = 0,
      beginTime
    } = params
    if ((endIndex - beginIndex) > findLimit) {
      throw new BadRequestException(`Limit matches request is ${findLimit}`)
    }
    const { accountId } = await this.getSummoner(value, region)
    const matchParams: MatchQueryDTO = {
      beginIndex,
      endIndex,
      beginTime
    }
    const matchesInfo = (await this.api.Match.list(accountId, region, matchParams))
      .response
    const { matches, totalGames } = matchesInfo

    if (totalGames > endIndex) {
      const newParams = cloneDeep(params)
      newParams.beginIndex = beginIndex + findLimit
      newParams.endIndex = endIndex + findLimit
      const loadMatches =
        await this.loadMatches(accountId, region, newParams)
      matches.push(...loadMatches)
    }

    return sortBy(matches, 'gameId')
  }

  private async getLastMatchTime (idSummoner: number): Promise<number | undefined> {
    const [match] = await this.getBySummoner(idSummoner, {
      order: {
        match: 'DESC'
      },
      take: 1
    })
    if (!match) {
      return
    }
    return new Date(match.gameCreation).getTime()
  }

  private async getBySummoner (idSummoner: number, options?: FindManyOptions<MatchParticipantsEntity>) {
    options = merge(options || {}, {
      where: {
        summoner: idSummoner
      },
      relations: ['match']
    })
    const matches = await this.participantsRepository.find(options)
    return matches.map(match => match.match as MatchEntity)
  }

  async updateMatches (idSummoner: number) {
    const { region } = await this.summonerRepository.findOneOrFail(idSummoner)
    const beginTime = await this.getLastMatchTime(idSummoner)
    const matches = await this.loadMatches(idSummoner, region, { beginTime })
    const instances = this.match(matches, idSummoner, region)
    await this.save(instances)
    return instances
  }

  async getBySummonerName (params: SummonerGetDTO) {
    const summoner = await this.summonerRepository.findOne({
      where: {
        name: params.summonerName,
        region: params.region
      }
    })
    if (!summoner) {
      throw new NotFoundException('User not found')
    }
    return this.getBySummoner(summoner.idSummoner)
  }
}
