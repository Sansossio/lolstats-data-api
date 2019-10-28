import { RepositoriesName } from '../repositories.enum'
import { MatchEntity } from '../entities/match.entity'

export const matchProvider = {
  provide: RepositoriesName.MATCH,
  useValue: MatchEntity
}
