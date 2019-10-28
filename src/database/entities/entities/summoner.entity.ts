import { ApiResponseModelProperty as ApiModelProperty } from '@nestjs/swagger'
import { SummonerLeagueEntity } from './summoner-league.entity'
import { BaseEntity } from '../../../base/Entity.base'
import Regions from '../../../enum/regions.enum'
import { MatchParticipantsEntity } from './match.participants.entity'
import { Table, Column, HasMany, Model, PrimaryKey } from 'sequelize-typescript'

@Table({
  tableName: 'summoners',
  indexes: [
    {
      name: 'index_summoner_region',
      fields: ['accountId', 'region'],
      unique: true
    }
  ]
})
export class SummonerEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryKey
  @Column({
    autoIncrement: true
  })
  idSummoner!: number

  @ApiModelProperty()
  @Column({
    type: 'varchar(63)'
  })
  id!: string

  @ApiModelProperty()
  @Column({ type: 'int' })
  profileIconId!: number

  @ApiModelProperty()
  @Column
  name!: string

  @ApiModelProperty()
  @Column({
    type: 'varchar(78)',
    allowNull: true,
    defaultValue: null
  })
  puuid?: string

  @ApiModelProperty()
  @Column({
    type: 'double',
    defaultValue: -1
  })
  summonerLevel?: number

  @ApiModelProperty()
  @Column({
    type: 'double',
    allowNull: true
  })
  revisionDate?: number

  @ApiModelProperty()
  @Column({
    type: 'varchar(56)',
    allowNull: true,
    defaultValue: null
  })
  accountId?: string

  @ApiModelProperty()
  @Column({
    defaultValue: true
  })
  loading?: boolean

  @ApiModelProperty()
  @Column({
    defaultValue: false
  })
  bot?: boolean

  @ApiModelProperty()
  @Column({ type: 'varchar(3)' })
  region!: Regions

  @ApiModelProperty({
    type: [SummonerLeagueEntity]
  })
  @HasMany(type => SummonerLeagueEntity)
  leagues!: SummonerLeagueEntity[]

  @HasMany(type => MatchParticipantsEntity)
  matchParticipants?: MatchParticipantsEntity[]
}
