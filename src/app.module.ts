import { Module } from '@nestjs/common'
import { RiotApiModule } from './riot-api/riot-api.module'
import { ConfigModule } from './config/config.module'
import { SummonerModule } from './summoner/summoner.module'
import { SummonerLeaguesModule } from './summoner-leagues/summoner-leagues.module'
import { TftMatchModule } from './tft-match/tft-match.module'
import { SeederModule } from './seeder/seeder.module'
import { DatabaseConnection } from './database/database.connection'
import { StaticDataModule } from './static-data/static-data.module'
import { BasicStatsModule } from './basic-stats/basic-stats.module'
import { CacheService } from './cache/cache.service'

@Module({
  imports: [
    DatabaseConnection,
    ConfigModule,
    RiotApiModule,
    SummonerModule,
    SummonerLeaguesModule,
    TftMatchModule,
    SeederModule,
    StaticDataModule,
    BasicStatsModule
  ],
  providers: [CacheService]
})
export class AppModule {}
