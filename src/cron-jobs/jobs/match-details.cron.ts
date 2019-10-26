import { Injectable, Logger } from '@nestjs/common'
import { NestSchedule, Interval } from 'nest-schedule'
import { RiotApiService } from '../../riot-api/riot-api.service'
import { ConfigService } from '../../config/config.service'
import { MatchRepositories } from '../../match/match.repository'
import { MatchDto } from '../../../../riot-games-api/src/dto/Match/Match/Match.dto'
import { getManager } from 'typeorm'
import { MatchEntity } from '../../match/entities/match.entity'
import { clone } from 'lodash'
import { SummonerService } from '../../summoner/summoner.service'
import Regions from '../../enum/regions.enum'
import { SummonerContextEntity } from '../../summoner/summoner.entity'
import { DBConnection } from '../../enum/database-connection.enum'
import { NOT_FOUND } from 'http-status-codes'
import { MatchParticipantsIdentitiesPlayerDto } from 'api-riot-games/dist/dto'

@Injectable()
export class MatchDetailsCron extends NestSchedule {
  private readonly api = this.riot.getLolApi().Match
  private readonly take = this.config.getNumber('cron.match.details.limit')

  constructor (
    private readonly config: ConfigService,
    private readonly matchRepositories: MatchRepositories,
    private readonly summonerService: SummonerService,
    private readonly riot: RiotApiService
  ) {
    super()
  }
  // Summoner methods
  private async findSummoner (player: MatchParticipantsIdentitiesPlayerDto, region: Regions, ignoreError: boolean = true) {
    try {
      return await this.summonerService.getOrCreateByAccountID(player, region)
    } catch (e) {
      if (!ignoreError || e.status !== NOT_FOUND) {
        throw e
      }
      // Find new summoner name
      const user = await this.summonerService.getOrCreateByAccountID(player, region)
      return this.findSummoner({
        ...player,
        summonerName: user.name
      }, region, false)
    }
  }
  // Internal methods
  private async upsertParticipants (match: MatchEntity, matchDetails: MatchDto) {
    const { matchesParticipants } = this.matchRepositories
    await getManager(DBConnection.CONTEXT).transaction(async repo => {
      const newParticipants = clone(match.matchParticipants)
      // Create new participants objects
      for (const participant of matchDetails.participantIdentities) {
        const {
          participantId,
          player
        } = participant
        const region = player.currentPlatformId as Regions
        const findParticipant = await this.findSummoner(player, region)
        const existsIndex = newParticipants
          .findIndex(p =>
            (p.summoner as SummonerContextEntity).idSummoner === findParticipant.idSummoner
          )
        if (existsIndex !== -1) {
          newParticipants[existsIndex].idMatchParticipant = participantId
        } else {
          newParticipants.push({
            summoner: findParticipant.idSummoner,
            match: match.idMatch,
            idMatchParticipant: participantId
          })
        }
      }
      const buildParticipants = newParticipants.map(p => matchesParticipants.create(p))
      await repo.save(buildParticipants)
    })
  }
  // Cron function
  @Interval(1000, { waiting: true })
  async loadMatchesInformation () {
    const contextLogs = 'MatchesDetailsCron'
    const matches = await this.matchRepositories.matches.find({
      where: {
        loading: true
      },
      order: {
        idMatch: 'ASC'
      },
      relations: ['matchParticipants', 'matchParticipants.summoner'],
      take: this.take
    })
    if (!Array.isArray(matches) || !matches.length) {
      return
    }
    Logger.log(`${matches.length} will be updated`, contextLogs)
    for (const match of matches) {
      try {
        const load = (await this.api.get(match.gameId, match.region)).response
        // Find details
        await this.upsertParticipants(match, load)
        // Remove loading
        match.loading = false
        await this.matchRepositories.matches.save(match)
      } catch (e) {
        Logger.error(e.error, contextLogs)
      }
    }
    Logger.log('Finish cron', contextLogs)
  }
}
