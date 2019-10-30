import { Module } from '@nestjs/common'
import { SummonerLeaguesService } from './summoner-leagues.service'
import { MongooseModule } from '@nestjs/mongoose'
import { SummonerLeagueModel } from './models/summoner-leagues.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      SummonerLeagueModel
    ])
  ],
  providers: [SummonerLeaguesService],
  exports: [SummonerLeaguesService]
})
export class SummonerLeaguesModule {}
