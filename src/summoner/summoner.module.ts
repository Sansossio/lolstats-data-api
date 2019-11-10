import { Module } from '@nestjs/common'
import { SummonerService } from './summoner.service'
import { SummonerController } from './summoner.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { SummonerModel } from './models/summoner.model'
import { SummonerLeaguesModule } from '../summoner-leagues/summoner-leagues.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      SummonerModel
    ]),
    SummonerLeaguesModule
  ],
  providers: [SummonerService],
  controllers: [SummonerController],
  exports: [SummonerService]
})
export class SummonerModule {}
