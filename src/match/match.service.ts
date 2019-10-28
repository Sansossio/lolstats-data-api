import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common'
import { RiotApiService } from '../riot-api/riot-api.service'
import { MatchEntity } from '../database/entities/entities/match.entity'
import { SummonerEntity } from '../database/entities/entities/summoner.entity'
import { sortBy, cloneDeep, set } from 'lodash'
import { MatchesFindParams } from './dto/summoner-matches.dto'
import { MatchQueryDTO } from 'api-riot-games/dist/dto'
import { Regions } from 'api-riot-games/dist/constants'
import { SummonerGetDTO } from '../summoner/dto/summoner.dto'
import { MatchListingMatches } from 'api-riot-games/dist/dto/Match/MatchListing/MatchListingMatches.dto'
import { FindOptions } from 'sequelize/types'
import { MatchParticipantsService } from '../match-participants/match-participants.service'
import { Transaction } from 'sequelize'
import { RepositoriesName } from '../database/database.enum'
import { DatabaseService } from '../database/database.service'

const findLimit = 100

@Injectable()
export class MatchService {
  private readonly api = this.riot.getLolApi()

  constructor (
    @Inject(RepositoriesName.MATCH)
    private readonly repository: typeof MatchEntity,
    @Inject(RepositoriesName.SUMMONER)
    private readonly summonerRepository: typeof SummonerEntity,

    private readonly databaseService: DatabaseService,
    private readonly matchParticipantsService: MatchParticipantsService,
    private readonly riot: RiotApiService
  ) {}

  // Internal
  private async getSummoner (find: number | string, region: Regions, transaction?: Transaction): Promise<SummonerEntity> {
    const key = typeof find === 'string' ? 'accountId' : 'idSummoner'
    const options: FindOptions = {
      where: {
        region
      },
      transaction
    }
    set(options, `where.${key}`, find)
    const data = await this.summonerRepository.findOne(options)
    if (!data) {
      throw new NotFoundException('User not found')
    }
    return data
  }

  private match (matches: MatchListingMatches[], summonerId: number, region: Regions): MatchEntity[] {
    return matches.map<MatchEntity>(match => this.repository.build({
      gameCreation: new Date(match.timestamp),
      gameId: match.gameId,
      queue: match.queue,
      season: match.season,
      region
    }))
  }

  private async loadMatches (value: number | string, region: Regions, params: MatchesFindParams = {}, transaction?: Transaction) {
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
      ({ accountId = '' } = await this.getSummoner(value, region, transaction))
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
        await this.loadMatches(accountId, region, newParams, transaction)
      matches.push(...loadMatches)
    }

    return sortBy(matches, 'gameId')
  }

  private async getLastMatchTime (idSummoner: number, transaction?: Transaction): Promise<number | undefined> {
    const [match] = await this.matchParticipantsService.getMatchesBySummoner(idSummoner, {
      order: [
        ['matchId', 'DESC']
      ],
      limit: 1,
      transaction
    })
    if (!match) {
      return
    }
    return new Date(match.gameCreation).getTime()
  }

  // Public methods
  async updateMatches (summoner: SummonerEntity, transaction?: Transaction) {
    if (!summoner) {
      throw new Error()
    }
    const finishTransaction = !transaction
    const dupEntryError = 'ER_DUP_ENTRY'
    const {
      idSummoner
    } = summoner
    const { region } = summoner
    transaction = await this.databaseService.getTransaction(transaction)
    const beginTime = await this.getLastMatchTime(idSummoner, transaction)
    const matches = await this.loadMatches(idSummoner, region, { beginTime }, transaction)
    const instances = this.match(matches, idSummoner, region)
    for (const instance of instances) {
      try {
        const match = await instance.save({ transaction })
        await this.matchParticipantsService.create(summoner.idSummoner, match.id, transaction)
      } catch (e) {
        // Ignore when is duplicated entry
        if (e.code !== dupEntryError) {
          // Rollback only if transaction was created here
          if (finishTransaction) {
            await transaction.rollback()
          }
          throw e
        }
      }
    }
    // Commit only if transaction was created here
    if (finishTransaction) {
      await transaction.commit()
    }
    return instances
  }

  async getBySummonerName (params: SummonerGetDTO, transaction?: Transaction) {
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
    return this.matchParticipantsService.getMatchesBySummoner(summoner.idSummoner)
  }

  // Getters
  async findMatches (options?: FindOptions) {
    return this.repository.findAll(options)
  }

  async findMatchParticipants (options?: FindOptions) {
    return this.matchParticipantsService.findAll(options)
  }
}
