import { Module } from '@nestjs/common'
import { SummonerController } from './summoner.controller'
import { SummonerService } from './summoner.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SummonerEntity } from './summoner.entity'
import { LeaguesModule } from '../leagues/leagues.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([SummonerEntity]),
    LeaguesModule
  ],
  controllers: [SummonerController],
  providers: [SummonerService]
})
export class SummonerModule {}
