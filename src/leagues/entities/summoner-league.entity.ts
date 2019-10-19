import { Entity, ManyToOne } from 'typeorm'
import { SummonerEntity } from '../../summoner/summoner.entity'
import { SummonerLeagueHistoricEntity } from '../../historic/entities/summoner/summoner-league.entity.historic'

@Entity('summoner_leagues')
export class SummonerLeagueEntity extends SummonerLeagueHistoricEntity {
  @ManyToOne(type => SummonerEntity, summoner => summoner.idSummoner)
  idSummoner?: number
}
