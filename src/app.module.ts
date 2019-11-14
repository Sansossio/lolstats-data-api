import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { RiotApiModule } from './riot-api/riot-api.module'
import { ConfigModule } from './config/config.module'
import { SummonerModule } from './summoner/summoner.module'
import { SummonerLeaguesModule } from './summoner-leagues/summoner-leagues.module'
import { TftMatchModule } from './tft-match/tft-match.module'
import { SeederModule } from './seeder/seeder.module'
import { DatabaseConnection } from './database/database.connection'
import { StaticDataModule } from './static-data/static-data.module'
import { ProfileStatsModule } from './profile-stats/profile-stats.module'
import { CacheService } from './cache/cache.service'
import { OriginMiddleware } from './middlewares/origin.middleware'
import { InformationModule } from './information/information.module';

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
    ProfileStatsModule,
    InformationModule
  ],
  providers: [CacheService]
})
export class AppModule implements NestModule {
  configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(OriginMiddleware)
      .forRoutes('*')
  }
}
