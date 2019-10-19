import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm'
import { ApiResponseModelProperty as ApiModelProperty } from '@nestjs/swagger'
import { Regions } from 'api-riot-games/dist/constants'
import { SummonerLeagueEntity } from '../leagues/entities/leagues.summoner.entity'

@Entity('summoners')
@Index('index_summoner_region', ['accountId', 'region'], { unique: true })
export class SummonerEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  idSummoner?: number

  @ApiModelProperty()
  @Column({ type: 'int' })
  profileIconId: number

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  name: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  puuid: string

  @ApiModelProperty()
  @Column({ type: 'double' })
  summonerLevel: number

  @ApiModelProperty()
  @Column({ type: 'double' })
  revisionDate: number

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  id: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  accountId: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  region: Regions

  @ApiModelProperty({
    type: [SummonerLeagueEntity]
  })
  @OneToMany(type => SummonerLeagueEntity, leagues => leagues.idSummoner, { cascade: true })
  leagues: SummonerLeagueEntity[]

  @ApiModelProperty({ example: new Date().toISOString() })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createAt?: Date

  @ApiModelProperty({ example: new Date().toISOString() })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updateAt?: Date
}
