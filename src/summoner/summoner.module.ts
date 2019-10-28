import { Module } from '@nestjs/common'
import { SummonerController } from './summoner.controller'
import { SummonerService } from './summoner.service'
import { LeaguesModule } from '../leagues/leagues.module'
import { MatchModule } from '../match/match.module'
import { summonerLeagueProvider, summonerProvider } from '../entities/providers'

@Module({
  imports: [
    MatchModule,
    LeaguesModule
  ],
  controllers: [SummonerController],
  providers: [
    // Database
    summonerProvider,
    summonerLeagueProvider,
    // Service
    SummonerService
  ],
  exports: [SummonerService]
})
export class SummonerModule {}
