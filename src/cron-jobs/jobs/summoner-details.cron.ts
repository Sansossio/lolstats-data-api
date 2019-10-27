import { SummonerService } from '../../summoner/summoner.service'
import { NestSchedule, Interval } from 'nest-schedule'
import { Injectable, Logger } from '@nestjs/common'
import { SummonerRepositories } from '../../summoner/summoner.repository'
import { ConfigService } from '../../config/config.service'
import { NOT_FOUND } from 'http-status-codes'
import Regions from '../../enum/regions.enum'
import { RiotApiService } from '../../riot-api/riot-api.service';

@Injectable()
export class UserDetailsCron extends NestSchedule {
  private readonly take = this.config.getNumber('cron.summoner.details.limit')
  private readonly api = this.riot.getLolApi().Summoner

  constructor (
    private readonly config: ConfigService,
    private readonly summonerService: SummonerService,
    private readonly repositories: SummonerRepositories,
    private readonly riot: RiotApiService
  ) {
    super()
  }

  private async setUserLoaded (idSummoner: number) {
    await this.repositories.summoner.update({ idSummoner }, { loading: false })
  }

  // Cron function
  @Interval(10 * 1000, { waiting: true })
  async loadSummonerDetails () {
    const contextLogs = 'MatchesDetailsCron'
    const summoners = await this.repositories.summoner.find({
      where: {
        loading: true
      },
      order: {
        idSummoner: 'ASC'
      },
      take: this.take
    })
    if (!summoners.length) {
      return
    }
    Logger.log(`${summoners.length} will be updated`, contextLogs)
    for (const summoner of summoners) {
      // Is disabled user, not load information
      const isDisabled = this.summonerService.isDisabledUser(summoner.id)
      if (isDisabled) {
        await this.setUserLoaded(summoner.idSummoner)
        continue
      }
      try {
        // Create new user
        const checkTime = false
        await this.summonerService.create({
          summonerName: summoner.name,
          accountId: summoner.accountId,
          region: summoner.region
        }, checkTime)
      } catch (e) {
        // Catch any error different of 404
        if (e.status !== NOT_FOUND) {
          Logger.error(e, contextLogs)
        }
      }
    }
    Logger.log('Finish cron', contextLogs)
  }
}
