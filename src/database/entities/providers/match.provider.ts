import { MatchEntity } from '../entities/match.entity'
import { RepositoriesName } from '../../database.enum'

export const matchProvider = {
  provide: RepositoriesName.MATCH,
  useValue: MatchEntity
}
