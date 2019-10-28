import { SummonerLeagueEntity } from '../entities/summoner-league.entity'
import { RepositoriesName } from '../../database.enum'

export const summonerLeagueProvider = {
  provide: RepositoriesName.SUMMONER_LEAGUE,
  useValue: SummonerLeagueEntity
}
