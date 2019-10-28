import { RepositoriesName } from '../repositories.enum'
import { MatchParticipantsEntity } from '../entities/match.participants.entity'

export const matchParticipantProvider = {
  provide: RepositoriesName.MATCH_PARTICIPANTS,
  useValue: MatchParticipantsEntity
}
