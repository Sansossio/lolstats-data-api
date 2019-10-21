import { Entity, ManyToOne, JoinColumn } from 'typeorm'
import * as Entities from 'lolstats-common/src/database/SummonerMatch.entity'
import { SummonerContextEntity } from '../../summoner/summoner.entity'

@Entity('summoner_matches')
export class SummonerMatchesEntity extends Entities.SummonerMatchesEntity {
  @ManyToOne(type => SummonerContextEntity, summoner => summoner.idSummoner)
  @JoinColumn({
    name: 'idSummoner'
  })
  idSummoner?: number
}
