import { Module } from '@nestjs/common'
import { ScheduleModule } from 'nest-schedule'
import { MatchDetailsCron } from './jobs/match-details.cron'
import { MatchModule } from '../match/match.module'
import { SummonerModule } from '../summoner/summoner.module'

@Module({
  imports: [
    MatchModule,
    SummonerModule,
    ScheduleModule.register()
  ],
  providers: [
    MatchDetailsCron
  ]
})
export class CronJobsModule {}
