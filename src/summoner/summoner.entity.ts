import { Entity, OneToMany, Index, Column } from 'typeorm'
import { ApiResponseModelProperty as ApiModelProperty } from '@nestjs/swagger'
import { SummonerLeagueContextEntity } from '../leagues/entities/summoner-league.entity'
import { SummonerEntity } from 'lolstats-common/src/database'
import Regions from 'lolstats-common/src/enum/riot/regions.riot.enum'
import { SummonerMatchesEntity } from '../match/entities/summoner-matches.entity'

@Entity('summoners')
@Index('index_summoner_region', ['accountId', 'region'], { unique: true })
export class SummonerContextEntity extends SummonerEntity {
  @ApiModelProperty({
    type: [SummonerLeagueContextEntity]
  })
  @OneToMany(type => SummonerLeagueContextEntity, leagues => leagues.idSummoner, { cascade: true })
  leagues: SummonerLeagueContextEntity[]

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  region: Regions

  // Hidden swagger
  @OneToMany(type => SummonerMatchesEntity, match => match.idSummoner, { cascade: true })
  matches?: SummonerMatchesEntity[]
}
