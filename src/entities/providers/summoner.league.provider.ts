import { RepositoriesName } from '../repositories.enum'
import { SummonerLeagueEntity } from '../entities/summoner-league.entity'

export const summonerLeagueProvider = {
  provide: RepositoriesName.SUMMONER_LEAGUE,
  useValue: SummonerLeagueEntity
}
