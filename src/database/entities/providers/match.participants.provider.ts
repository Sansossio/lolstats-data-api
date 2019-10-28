import { MatchParticipantsEntity } from '../entities/match.participants.entity'
import { RepositoriesName } from '../../database.enum'

export const matchParticipantProvider = {
  provide: RepositoriesName.MATCH_PARTICIPANTS,
  useValue: MatchParticipantsEntity
}
