import { Entity, OneToMany, Index, Column, PrimaryGeneratedColumn } from 'typeorm'
import { ApiResponseModelProperty as ApiModelProperty } from '@nestjs/swagger'
import { SummonerLeagueContextEntity } from '../leagues/entities/summoner-league.entity'
import { SummonerMatchesEntity } from '../match/entities/summoner-matches.entity'
import { BaseEntity } from '../base/Entity.base'

@Entity('summoners')
@Index('index_summoner_region', ['accountId', 'region'], { unique: true })
export class SummonerContextEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  idSummoner: number = 0

  @ApiModelProperty()
  @Column({ type: 'int' })
  profileIconId: number = 0

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  name!: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  puuid!: string

  @ApiModelProperty()
  @Column({
    type: 'double',
    default: -1
  })
  summonerLevel?: number

  @ApiModelProperty()
  @Column({
    type: 'double',
    nullable: true
  })
  revisionDate?: number

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  id!: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  accountId!: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  region!: string

  @ApiModelProperty({
    type: [SummonerLeagueContextEntity]
  })
  @OneToMany(type => SummonerLeagueContextEntity, leagues => leagues.idSummoner, { cascade: true })
  leagues!: SummonerLeagueContextEntity[]

  @OneToMany(type => SummonerMatchesEntity, match => match.idSummoner, { cascade: true })
  matches?: SummonerMatchesEntity[]
}
