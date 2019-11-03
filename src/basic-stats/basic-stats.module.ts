import { Module } from '@nestjs/common'
import { BasicTftStatsService } from './basic-tft-stats.service'
import { MongooseModule } from '@nestjs/mongoose'
import { SummonerModel } from '../summoner/models/summoner.model'
import { TftMatchModel } from '../tft-match/models/match/tft-match.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      SummonerModel,
      TftMatchModel
    ]),
  ],
  providers: [
    BasicTftStatsService
  ],
  exports: [
    BasicTftStatsService
  ]
})
export class BasicStatsModule {}
