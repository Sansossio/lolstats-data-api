import { Module } from '@nestjs/common'
import { MatchController } from './match.controller'
import { MatchService } from './match.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DBConnection } from '../enum/database-connection.enum'
import { MatchEntity } from './entities/match.entity'
import { SummonerContextEntity } from '../summoner/summoner.entity'
import { MatchParticipantsEntity } from './entities/match.participants.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SummonerContextEntity,
      MatchEntity,
      MatchParticipantsEntity
    ],
    DBConnection.CONTEXT
    )
  ],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService]
})
export class MatchModule {}
