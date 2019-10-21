import { Module } from '@nestjs/common'
import { MatchController } from './match.controller'
import { MatchService } from './match.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SummonerMatchesEntity } from './entities/summoner-matches.entity'
import { DBConnection } from '../enum/database-connection.enum'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SummonerMatchesEntity
    ],
    DBConnection.CONTEXT
    )
  ],
  controllers: [MatchController],
  providers: [MatchService]
})
export class MatchModule {}
