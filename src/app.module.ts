import { Module } from '@nestjs/common'
import { RiotApiModule } from './riot-api/riot-api.module'
import { ConfigModule } from './config/config.module'
import { SummonerModule } from './summoner/summoner.module'
import { SummonerLeaguesModule } from './summoner-leagues/summoner-leagues.module'
import { TftMatchModule } from './tft-match/tft-match.module'
import { SeederModule } from './seeder/seeder.module'
import { DatabaseConnection } from './database/database.connection'
import { StaticDataModule } from './static-data/static-data.module';

@Module({
  imports: [
    DatabaseConnection,
    ConfigModule,
    RiotApiModule,
    SummonerModule,
    SummonerLeaguesModule,
    TftMatchModule,
    SeederModule,
    StaticDataModule
  ]
})
export class AppModule {}
