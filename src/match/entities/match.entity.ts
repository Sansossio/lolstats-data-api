import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany, JoinColumn } from 'typeorm'
import { BaseEntity } from '../../base/Entity.base'
import { ApiModelProperty } from '@nestjs/swagger'
import { Regions } from 'api-riot-games/dist/constants'
import { MatchParticipantsEntity } from './match.participants.entity'

@Entity('match')
@Index('index_gameid_region', ['gameId', 'region'], { unique: true })
export class MatchEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  idMatch?: number

  @ApiModelProperty({ type: String })
  @Column({ type: 'varchar' })
  region!: Regions

  @ApiModelProperty()
  @Column({ type: 'double' })
  gameId!: number

  @ApiModelProperty()
  @Column()
  queue!: number

  @ApiModelProperty({
    example: new Date().toISOString()
  })
  @Column({ type: 'timestamp' })
  gameCreation!: Date

  @ApiModelProperty()
  @Column()
  season!: number

  @ApiModelProperty()
  @Column({
    default: true
  })
  loading?: boolean = true

  @ApiModelProperty({
    type: [MatchParticipantsEntity]
  })
  @OneToMany(type => MatchParticipantsEntity, match => match.match, { cascade: true })
  matchParticipants!: MatchParticipantsEntity[]
}
