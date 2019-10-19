import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SummonerLeagueHistoricEntity } from './entities/summoner/summoner-league.entity.historic'
import { DBConnection } from '../enum/database-connection.enum'

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        SummonerLeagueHistoricEntity
      ],
      DBConnection.HISTORIC
    )
  ]
})
export class HistoricModule {}
