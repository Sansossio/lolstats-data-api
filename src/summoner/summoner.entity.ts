import { Entity, OneToMany, Index, Column, PrimaryGeneratedColumn } from 'typeorm'
import { ApiResponseModelProperty as ApiModelProperty } from '@nestjs/swagger'
import { SummonerLeagueContextEntity } from '../leagues/entities/summoner-league.entity'
import { BaseEntity } from '../base/Entity.base'
import Regions from '../enum/regions.enum'
import { MatchParticipantsEntity } from '../match/entities/match.participants.entity'

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
  @Column({
    type: 'varchar',
    nullable: true,
    default: null
  })
  puuid?: string

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
  @Column({
    type: 'varchar',
    nullable: true,
    default: null
  })
  id?: string

  @ApiModelProperty()
  @Column({
    type: 'varchar',
    nullable: true,
    default: null
  })
  accountId?: string

  @ApiModelProperty()
  @Column({
    default: true
  })
  loading?: boolean = true

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  region!: Regions

  @ApiModelProperty({
    type: [SummonerLeagueContextEntity]
  })
  @OneToMany(type => SummonerLeagueContextEntity, leagues => leagues.idSummoner, { cascade: true })
  leagues!: SummonerLeagueContextEntity[]

  @OneToMany(type => MatchParticipantsEntity, match => match.summoner, { cascade: true })
  matchParticipants?: MatchParticipantsEntity[]
}
