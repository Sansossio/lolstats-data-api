import { Module } from '@nestjs/common'
import { LeaguesService } from './leagues.service'
import { ConfigModule } from '../config/config.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SummonerLeagueContextEntity } from './entities/summoner-league.entity'
import { DBConnection } from '../enum/database-connection.enum'

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        SummonerLeagueContextEntity
      ],
      DBConnection.CONTEXT
    )
  ],
  providers: [LeaguesService],
  exports: [LeaguesService]
})
export class LeaguesModule {}
