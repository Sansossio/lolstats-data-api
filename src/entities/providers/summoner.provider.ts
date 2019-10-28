import { RepositoriesName } from '../repositories.enum'
import { SummonerEntity } from '../entities/summoner.entity'

export const summonerProvider = {
  provide: RepositoriesName.SUMMONER,
  useValue: SummonerEntity
}
