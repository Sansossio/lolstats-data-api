import { Injectable, Logger } from '@nestjs/common'
import { NestSchedule, Interval } from 'nest-schedule'
import { RiotApiService } from '../../riot-api/riot-api.service'
import { ConfigService } from '../../config/config.service'
import { MatchRepositories } from '../../match/match.repository'
import { MatchDto } from '../../../../riot-games-api/src/dto/Match/Match/Match.dto'
import { getManager, getConnection } from 'typeorm'
import { MatchEntity } from '../../match/entities/match.entity'
import { cloneDeep } from 'lodash'
import { SummonerService } from '../../summoner/summoner.service'
import Regions from '../../enum/regions.enum'
import { SummonerContextEntity } from '../../summoner/summoner.entity'
import { DBConnection } from '../../enum/database-connection.enum'
import * as cronUtils from './utils.cron'
import { MatchParticipantsIdentitiesPlayerDto } from 'api-riot-games/dist/dto'
import { NOT_FOUND } from 'http-status-codes'

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
    return this.summonerService.getOrCreateByAccountID(player, region)
  }
  // Internal methods
  private async setLoaded (idMatch: number) {
    return this.matchRepositories.matches.update({ idMatch }, { loading: false })
  }

  private async upsertParticipants (match: MatchEntity, matchDetails: MatchDto) {
    const { matchesParticipants } = this.matchRepositories
    await getManager(DBConnection.CONTEXT).transaction(async repo => {
      const newParticipants = cloneDeep(match.matchParticipants)
        .map((participant) => {
          participant.match = match.idMatch
          return participant
        })
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
            (p.summoner as SummonerContextEntity).idSummoner === findParticipant.idSummoner &&
            p.match === match.idMatch
          )
        const participantBaseObject = {
          summoner: findParticipant,
          participantId: participantId,
          match
        }
        if (existsIndex !== -1) {
          newParticipants[existsIndex] = Object.assign(
            newParticipants[existsIndex],
            participantBaseObject
          )
        } else {
          newParticipants.push(participantBaseObject)
        }
      }
      const buildParticipants = newParticipants.map(p => matchesParticipants.create(p))
      await repo.save(buildParticipants)
    })
  }
  // Cron function
  @Interval(5 * 1000, { waiting: true })
  async loadMatchesDetails () {
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
        await this.setLoaded(match.idMatch as number)
      } catch (e) {
        if (cronUtils.exitJob(e)) {
          return
        }
        // If match doesn't exists, mark as loaded
        if (e.status === NOT_FOUND) {
          await this.setLoaded(match.idMatch as number)
        }
        // Show error
        if (cronUtils.showError(e)) {
          Logger.error(e, contextLogs)
        }
      }
    }
    Logger.log('Finish cron', contextLogs)
  }
}
