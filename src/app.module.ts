import { Module } from '@nestjs/common'
import { ConfigService } from './config/config.service'
import { SummonerModule } from './summoner/summoner.module'
import { RiotApiModule } from './riot-api/riot-api.module'
import { LeaguesModule } from './leagues/leagues.module'
import { MatchModule } from './match/match.module'
import { DatabaseModule } from './database/database.module'

@Module({
  imports: [
    DatabaseModule,
    RiotApiModule,
    SummonerModule,
    LeaguesModule,
    MatchModule,
    DatabaseModule
  ],
  providers: [ConfigService]
})
export class AppModule {}
