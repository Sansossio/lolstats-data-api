import { Module } from '@nestjs/common'
import { ProfileTftStatsService } from './profile-tft-stats.service'
import { MongooseModule } from '@nestjs/mongoose'
import { SummonerModel } from '../summoner/models/summoner.model'
import { TftMatchModel } from '../tft-match/models/match/tft-match.model'
import { TftSummonerStatsModel } from './models/tft/profile-tft-stats.model'
import { BasicTftStatsController } from './profile-stats.tft.controller'
import { SummonerModule } from '../summoner/summoner.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      SummonerModel,
      TftMatchModel,
      TftSummonerStatsModel
    ]),
    SummonerModule
  ],
  providers: [
    ProfileTftStatsService
  ],
  exports: [
    ProfileTftStatsService
  ],
  controllers: [BasicTftStatsController]
})
export class ProfileStatsModule {}
