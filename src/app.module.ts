import { Module } from '@nestjs/common'
import { RiotApiModule } from './riot-api/riot-api.module'
import { ConfigModule } from './config/config.module'
import { SummonerModule } from './summoner/summoner.module'
import { ConfigService } from './config/config.service'
import { MongooseModule } from '@nestjs/mongoose'
import { SummonerLeaguesModule } from './summoner-leagues/summoner-leagues.module'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.getConnection()
    }),
    ConfigModule,
    RiotApiModule,
    SummonerModule,
    SummonerLeaguesModule
  ]
})
export class AppModule {}
