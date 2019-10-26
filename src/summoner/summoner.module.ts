import { Module } from '@nestjs/common'
import { SummonerController } from './summoner.controller'
import { SummonerService } from './summoner.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SummonerContextEntity } from './summoner.entity'
import { LeaguesModule } from '../leagues/leagues.module'
import { DBConnection } from '../enum/database-connection.enum'
import { MatchModule } from '../match/match.module'

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        SummonerContextEntity
      ],
      DBConnection.CONTEXT
    ),
    MatchModule,
    LeaguesModule
  ],
  controllers: [SummonerController],
  providers: [SummonerService],
  exports: [SummonerService]
})
export class SummonerModule {}
