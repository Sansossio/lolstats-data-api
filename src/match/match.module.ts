import { Module } from '@nestjs/common'
import { MatchController } from './match.controller'
import { MatchService } from './match.service'
import { matchParticipantProvider } from '../entities/providers/match.participants.provider'
import { matchProvider } from '../entities/providers/match.provider'
import { summonerProvider } from '../entities/providers/summoner.provider'

@Module({
  imports: [],
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
