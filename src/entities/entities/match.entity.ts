import { BaseEntity } from '../../base/Entity.base'
import { ApiModelProperty } from '@nestjs/swagger'
import { Regions } from 'api-riot-games/dist/constants'
import { MatchParticipantsEntity } from './match.participants.entity'
import { Table, Column, HasMany, PrimaryKey } from 'sequelize-typescript'

@Table({
  tableName: 'match',
  indexes: [
    {
      name: 'index_gameid_region',
      fields: ['gameId', 'region'],
      unique: true
    }
  ]
})
export class MatchEntity extends BaseEntity {
  @ApiModelProperty()
  id?: number

  @ApiModelProperty({ type: String })
  @Column({
    type: 'varchar(3)'
  })
  region!: Regions

  @ApiModelProperty()
  @Column({ type: 'double' })
  gameId!: number

  @ApiModelProperty()
  @Column
  queue!: number

  @ApiModelProperty({
    example: new Date().toISOString()
  })
  @Column({ type: 'timestamp' })
  gameCreation!: Date

  @ApiModelProperty()
  @Column
  season!: number

  @ApiModelProperty()
  @Column({
    defaultValue: true
  })
  loading?: boolean = true

  @ApiModelProperty({
    type: [MatchParticipantsEntity]
  })
  @HasMany(type => MatchParticipantsEntity)
  matchParticipants!: MatchParticipantsEntity[]
}
