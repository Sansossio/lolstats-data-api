import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SummonerContextEntity } from '../../summoner/summoner.entity'
import { ApiModelProperty } from '@nestjs/swagger'
import { BaseEntity } from '../../base/Entity.base'

@Entity('summoner_leagues')
export class SummonerLeagueContextEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  idSummonerLeague?: number

  @ApiModelProperty()
  @ManyToOne(type => SummonerContextEntity, summoner => summoner.idSummoner)
  @JoinColumn({
    name: 'idSummoner'
  })
  idSummoner?: number

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  queueType!: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
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
  @Column({ type: 'varchar' })
  leagueId!: string

  @ApiModelProperty()
  @Column({ type: 'boolean' })
  inactive!: boolean

  @ApiModelProperty()
  @Column({ type: 'boolean' })
  freshBlood!: boolean

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  tier!: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  summonerId!: string

  @ApiModelProperty()
  @Column({ type: 'int' })
  leaguePoints!: number
}
