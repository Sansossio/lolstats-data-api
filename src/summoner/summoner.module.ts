import { Module } from '@nestjs/common'
import { SummonerService } from './summoner.service'
import { SummonerController } from './summoner.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { SummonerModel } from './models/summoner.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      SummonerModel
    ])
  ],
  providers: [SummonerService],
  controllers: [SummonerController]
})
export class SummonerModule {}
