import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common'
import { RiotApiService } from '../riot-api/riot-api.service'
import { MatchEntity } from '../entities/entities/match.entity'
import { SummonerEntity } from '../entities/entities/summoner.entity'
import { sortBy, cloneDeep, set, merge } from 'lodash'
import { MatchesFindParams } from './dto/summoner-matches.dto'
import { MatchQueryDTO } from 'api-riot-games/dist/dto'
import { Regions } from 'api-riot-games/dist/constants'
import { MatchParticipantsEntity } from '../entities/entities/match.participants.entity'
import { SummonerGetDTO } from '../summoner/dto/summoner.dto'
import { MatchListingMatches } from 'api-riot-games/dist/dto/Match/MatchListing/MatchListingMatches.dto'
import { RepositoriesName } from '../entities/repositories.enum'
import { FindOptions } from 'sequelize/types'

const findLimit = 100

@Injectable()
export class MatchService {
  private readonly api = this.riot.getLolApi()

  constructor (
    @Inject(RepositoriesName.MATCH)
    private readonly repository: typeof MatchEntity,
    @Inject(RepositoriesName.MATCH_PARTICIPANTS)
    private readonly participantsRepository: typeof MatchParticipantsEntity,
    @Inject(RepositoriesName.SUMMONER)
    private readonly summonerRepository: typeof SummonerEntity,

    private readonly riot: RiotApiService
  ) {}

  // Internal
  private async getSummoner (find: number | string, region: Regions): Promise<SummonerEntity> {
    const key = typeof find === 'string' ? 'accountId' : 'idSummoner'
    const options: FindOptions = {
      where: {
        region
      }
    }
    set(options, `where.${key}`, find)
    const data = await this.summonerRepository.findOne(options)
    if (!data) {
      throw new NotFoundException('User not found')
    }
    return data
  }

  private match (matches: MatchListingMatches[], summonerId: number, region: Regions): MatchEntity[] {
    const matchParticipants = [
      this.participantsRepository.build({
        participantId: -1,
        summonerId
      })
    ]
    return matches.map<MatchEntity>(match => this.repository.build({
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
    let { accountId } = params
    if ((endIndex - beginIndex) > findLimit) {
      throw new BadRequestException(`Limit matches request is ${findLimit}`)
    }
    if (!accountId) {
      ({ accountId = '' } = await this.getSummoner(value, region))
      params.accountId = accountId
    }
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
      order: [
        ['matchId', 'DESC']
      ],
      limit: 1
    })
    if (!match) {
      return
    }
    return new Date(match.gameCreation).getTime()
  }

  private async getBySummoner (summonerId?: number, options?: FindOptions) {
    if (!summonerId) {
      return []
    }
    options = merge(options || {}, {
      where: {
        summonerId
      },
      include: ['match']
    })
    const matches = await this.participantsRepository.findAll(options)
    return matches.map(match => match.match)
  }

  // Public methods
  async updateMatches (summoner: SummonerEntity) {
    if (!summoner) {
      throw new Error()
    }
    const dupEntryError = 'ER_DUP_ENTRY'
    const {
      idSummoner
    } = summoner
    const { region } = summoner
    const beginTime = await this.getLastMatchTime(idSummoner)
    const matches = await this.loadMatches(idSummoner, region, { beginTime })
    const instances = this.match(matches, idSummoner, region)
    for (const instance of instances) {
      try {
        await instance.save()
      } catch (e) {
        // Ignore when is duplicated entry
        if (e.code !== dupEntryError) {
          throw e
        }
      }
    }
    return instances
  }

  async getBySummonerName (params: SummonerGetDTO) {
    const summoner = await this.summonerRepository.findOne({
      where: {
        name: params.summonerName,
        region: params.region,
        bot: false
      }
    })
    if (!summoner) {
      throw new NotFoundException('User not found')
    }
    return this.getBySummoner(summoner.idSummoner)
  }

  // Getters
  async findMatches (options?: FindOptions) {
    return this.repository.findAll(options)
  }

  async findMatchParticipants (options?: FindOptions) {
    return this.participantsRepository.findAll(options)
  }
}
