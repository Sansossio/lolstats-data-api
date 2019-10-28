import { SummonerService } from '../../summoner/summoner.service'
import { NestSchedule, Interval } from 'nest-schedule'
import { Injectable, Logger } from '@nestjs/common'
import { SummonerRepositories } from '../../summoner/summoner.repository'
import { ConfigService } from '../../config/config.service'
import * as cronUtils from './utils.cron'
import * as summonerUtils from '../../summoner/summoner.utils'
import { SummonerContextEntity } from '../../summoner/summoner.entity'

const contextLogs = 'SummonersDetailsCron'

@Injectable()
export class UserDetailsCron extends NestSchedule {
  private readonly take = this.config.getNumber('cron.summoner.details.limit')

  constructor (
    private readonly config: ConfigService,
    private readonly summonerService: SummonerService,
    private readonly repositories: SummonerRepositories
  ) {
    super()
  }

  private async setUserLoaded (idSummoner: number) {
    await this.repositories.summoner.update({ idSummoner }, { loading: false })
  }

  async updateSummoner (summoner: SummonerContextEntity) {
    // Is disabled user, not load information
    const isDisabled = summonerUtils.isBot(summoner.id || '')
    if (isDisabled) {
      await this.setUserLoaded(summoner.idSummoner)
      return
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
      if (cronUtils.exitJob(e)) {
        return
      }
      if (cronUtils.showError(e)) {
        Logger.error(e, contextLogs)
      }
    }
  }

  // Cron function
  @Interval(5 * 1000, { waiting: true })
  async loadSummonerDetails () {
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
    const summonersList = summoners.map(summoner => this.updateSummoner(summoner))
    await Promise.all(summonersList)
    Logger.log('Finish cron', contextLogs)
  }
}
