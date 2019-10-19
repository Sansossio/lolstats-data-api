import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger'

@Entity('historic_summoner_leagues')
export class SummonerLeagueHistoricEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  idSummonerLeague?: number

  @ApiModelProperty()
  @Column({ type: 'int' })
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
  @Column({ type: 'tinyint' })
  rank: number

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
