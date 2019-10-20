import { Module } from '@nestjs/common'
import { ConfigService } from './config/config.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from './config/config.module'
import { SummonerModule } from './summoner/summoner.module'
import { RiotApiModule } from './riot-api/riot-api.module'
import { LeaguesModule } from './leagues/leagues.module'
import { DBConnection } from './enum/database-connection.enum'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: DBConnection.CONTEXT,
      imports: [ConfigModule],
      useExisting: ConfigService
    }),
    RiotApiModule,
    SummonerModule,
    LeaguesModule
  ],
  providers: [ConfigService]
})
export class AppModule {}
