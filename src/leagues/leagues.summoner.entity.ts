import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger'
import { SummonerEntity } from 'src/summoner/summoner.entity'

@Entity('summoner_leagues')
export class SummonerLeagueEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  idSummonerLeague?: number

  @ManyToOne(type => SummonerEntity, summoner => summoner.idSummoner)
  idSummoner?: number

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  queueType: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  summonerName: string

  @ApiModelProperty()
  @Column({ type: 'boolean' })
  hotStreak: boolean

  // @ApiModelProperty()
  // @Column({ type: 'MiniSeriesDTO' })
  // miniSeries

  @ApiModelProperty()
  @Column({ type: 'int' })
  wins: number

  @ApiModelProperty()
  @Column({ type: 'boolean' })
  veteran: boolean

  @ApiModelProperty()
  @Column({ type: 'int' })
  losses: number

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  rank: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  leagueId: string

  @ApiModelProperty()
  @Column({ type: 'boolean' })
  inactive: boolean

  @ApiModelProperty()
  @Column({ type: 'boolean' })
  freshBlood: boolean

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  tier: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  summonerId: string

  @ApiModelProperty()
  @Column({ type: 'int' })
  leaguePoints: number
}
