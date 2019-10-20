import { Entity } from 'typeorm'
import { SummonerLeagueEntity } from 'lolstats-common/src/database'

@Entity('historic_summoner_leagues')
export class SummonerLeagueHistoricEntity extends SummonerLeagueEntity {}
