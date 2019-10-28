import { Module } from '@nestjs/common'
import { LeaguesService } from './leagues.service'
import { summonerLeagueProvider } from '../database/entities/providers/summoner.league.provider'

@Module({
  imports: [],
  providers: [
    // Database
    summonerLeagueProvider,
    // Services
    LeaguesService
  ],
  exports: [LeaguesService]
})
export class LeaguesModule {}
