import { Module } from '@nestjs/common'
import { MatchController } from './match.controller'
import { MatchService } from './match.service'
import { matchParticipantProvider } from '../database/entities/providers/match.participants.provider'
import { matchProvider } from '../database/entities/providers/match.provider'
import { summonerProvider } from '../database/entities/providers/summoner.provider'
import { MatchParticipantsModule } from '../match-participants/match-participants.module'

@Module({
  imports: [
    MatchParticipantsModule
  ],
  controllers: [MatchController],
  providers: [
    // Database
    matchProvider,
    matchParticipantProvider,
    summonerProvider,
    // Service
    MatchService
  ],
  exports: [MatchService]
})
export class MatchModule {}
