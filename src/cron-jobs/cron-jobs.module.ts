import { Module } from '@nestjs/common'
import { ScheduleModule } from 'nest-schedule'
import { MatchDetailsCron } from './jobs/match-details.cron'
import { MatchModule } from '../match/match.module'
import { SummonerModule } from '../summoner/summoner.module'
import { UserDetailsCron } from './jobs/summoner-details.cron'

@Module({
  imports: [
    MatchModule,
    SummonerModule,
    ScheduleModule.register()
  ],
  providers: [
    MatchDetailsCron,
    UserDetailsCron
  ]
})
export class CronJobsModule {}
