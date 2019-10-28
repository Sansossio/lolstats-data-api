import { SummonerEntity } from '../entities/summoner.entity'
import { RepositoriesName } from '../../database.enum'

export const summonerProvider = {
  provide: RepositoriesName.SUMMONER,
  useValue: SummonerEntity
}
