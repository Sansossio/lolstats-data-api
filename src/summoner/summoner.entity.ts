import { Entity, OneToMany, Index, Column } from 'typeorm'
import { ApiResponseModelProperty as ApiModelProperty } from '@nestjs/swagger'
import { SummonerLeagueContextEntity } from '../leagues/entities/summoner-league.entity'
import { SummonerEntity } from 'lolstats-common/src/database'
import { Regions } from 'api-riot-games/dist/constants'

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
}
