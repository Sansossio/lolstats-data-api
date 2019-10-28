import { BaseEntity } from '../../base/Entity.base'
import { ApiModelProperty } from '@nestjs/swagger'
import { MatchEntity } from './match.entity'
import { SummonerEntity } from './summoner.entity'
import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript'

export const matchParticipantsName = 'match_participants'

@Table({
  tableName: matchParticipantsName,
  indexes: [
    {
      name: 'index_summoner_match',
      fields: ['summonerId', 'matchId'],
      unique: true
    }
  ]
})
export class MatchParticipantsEntity extends BaseEntity {
  @ApiModelProperty()
  id?: number = 0

  @ApiModelProperty()
  @Column
  participantId?: number

  @ForeignKey(() => MatchEntity)
  @Column
  matchId!: number

  @BelongsTo(() => MatchEntity)
  match!: MatchEntity

  @ForeignKey(() => SummonerEntity)
  @Column
  summonerId!: number

  @BelongsTo(() => SummonerEntity)
  summoner!: SummonerEntity
}
