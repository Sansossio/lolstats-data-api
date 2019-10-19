import { Module } from '@nestjs/common'
import { SummonerController } from './summoner.controller'
import { SummonerService } from './summoner.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SummonerEntity } from './summoner.entity'
import { LeaguesModule } from '../leagues/leagues.module'
import { DBConnection } from '../enum/database-connection.enum'

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        SummonerEntity
      ],
      DBConnection.CONTEXT
    ),
    LeaguesModule
  ],
  controllers: [SummonerController],
  providers: [SummonerService]
})
export class SummonerModule {}
