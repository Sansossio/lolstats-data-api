import { Module } from '@nestjs/common'
import { ConfigService } from './config/config.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from './config/config.module'
import { SummonerModule } from './summoner/summoner.module'
import { RiotApiModule } from './riot-api/riot-api.module'
import { LeaguesService } from './leagues/leagues.service'
import { LeaguesModule } from './leagues/leagues.module'
import { HistoricModule } from './historic/historic.module'
import { DBConnection } from './enum/database-connection.enum'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: DBConnection.CONTEXT,
      imports: [ConfigModule],
      useExisting: ConfigService
    }),
    TypeOrmModule.forRootAsync({
      name: DBConnection.HISTORIC,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.createTypeOrmOptionsHistoric()
    }),
    RiotApiModule,
    SummonerModule,
    LeaguesModule,
    HistoricModule
  ],
  providers: [ConfigService]
})
export class AppModule {}
