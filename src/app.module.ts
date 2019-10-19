import { Module } from '@nestjs/common'
import { ConfigService } from './config/config.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from './config/config.module'
import { SummonerModule } from './summoner/summoner.module'
import { RiotApiModule } from './riot-api/riot-api.module'
import { LeaguesService } from './leagues/leagues.service'
import { LeaguesModule } from './leagues/leagues.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService
    }),
    RiotApiModule,
    SummonerModule,
    LeaguesModule
  ],
  providers: [ConfigService, LeaguesService]
})
export class AppModule {}
