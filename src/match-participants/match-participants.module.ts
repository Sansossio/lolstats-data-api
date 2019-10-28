import { Module } from '@nestjs/common'
import { MatchParticipantsService } from './match-participants.service'
import { matchParticipantProvider } from '../database/entities/providers/match.participants.provider'

@Module({
  providers: [
    // Database
    matchParticipantProvider,
    // Services
    MatchParticipantsService
  ],
  exports: [MatchParticipantsService]
})
export class MatchParticipantsModule {}
