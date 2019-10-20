import { Entity, ManyToOne } from 'typeorm'
import { SummonerContextEntity } from '../../summoner/summoner.entity'
import { SummonerLeagueEntity } from 'lolstats-common/src/database'

@Entity('summoner_leagues')
export class SummonerLeagueContextEntity extends SummonerLeagueEntity {
  @ManyToOne(type => SummonerContextEntity, summoner => summoner.idSummoner)
  idSummoner?: number
}
