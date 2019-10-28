import { SummonerEntity } from './summoner.entity'
import { ApiModelProperty } from '@nestjs/swagger'
import { BaseEntity } from '../../base/Entity.base'
import { Table, Column, BelongsTo, ForeignKey } from 'sequelize-typescript'

@Table({
  tableName: 'summoner_leagues'
})
export class SummonerLeagueEntity extends BaseEntity {
  @ApiModelProperty()
  id?: number

  @ApiModelProperty()
  @BelongsTo(() => SummonerEntity)
  summoner!: SummonerEntity

  @ApiModelProperty({
    type: SummonerEntity
  })
  @ForeignKey(() => SummonerEntity)
  summonerId?: number

  @ApiModelProperty()
  @Column
  queueType!: string

  @ApiModelProperty()
  @Column
  summonerName!: string

  @ApiModelProperty()
  @Column({ type: 'boolean' })
  hotStreak!: boolean

  @ApiModelProperty()
  @Column({ type: 'int' })
  wins!: number

  @ApiModelProperty()
  @Column({ type: 'boolean' })
  veteran!: boolean

  @ApiModelProperty()
  @Column({ type: 'int' })
  losses!: number

  @ApiModelProperty()
  @Column({ type: 'tinyint' })
  rank!: number

  @ApiModelProperty()
  @Column
  leagueId!: string

  @ApiModelProperty()
  @Column({ type: 'boolean' })
  inactive!: boolean

  @ApiModelProperty()
  @Column({ type: 'boolean' })
  freshBlood!: boolean

  @ApiModelProperty()
  @Column
  tier!: string

  @ApiModelProperty()
  @Column({ type: 'int' })
  leaguePoints!: number
}
