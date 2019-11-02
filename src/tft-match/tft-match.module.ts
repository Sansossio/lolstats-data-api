import { Module } from '@nestjs/common'
import { TftMatchService } from './tft-match.service'
import { TftMatchController } from './tft-match.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { TftMatchModel } from './models/match/tft-match.model'
import { SummonerModule } from '../summoner/summoner.module'
import { StaticDataModule } from '../static-data/static-data.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      TftMatchModel
    ]),
    SummonerModule,
    StaticDataModule
  ],
  providers: [TftMatchService],
  controllers: [TftMatchController]
})
export class TftMatchModule {}
