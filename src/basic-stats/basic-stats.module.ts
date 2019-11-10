import { Module } from '@nestjs/common'
import { BasicTftStatsService } from './basic-tft-stats.service'
import { MongooseModule } from '@nestjs/mongoose'
import { SummonerModel } from '../summoner/models/summoner.model'
import { TftMatchModel } from '../tft-match/models/match/tft-match.model'
import { TftSummonerStatsModel } from './models/tft/basic-stats.model'
import { BasicTftStatsController } from './basic-stats.tft.controller'
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
    BasicTftStatsService
  ],
  exports: [
    BasicTftStatsService
  ],
  controllers: [BasicTftStatsController]
})
export class BasicStatsModule {}
