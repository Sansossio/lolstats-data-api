import { BaseEntity } from '../../base/Entity.base'
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToOne } from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger'
import { MatchEntity } from './match.entity'
import { SummonerContextEntity } from '../../summoner/summoner.entity'

export const matchParticipantsName = 'match_participants'

@Entity(matchParticipantsName)
export class MatchParticipantsEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  idMatchParticipant?: number = 0

  @ApiModelProperty()
  @Column({
    default: null,
    nullable: true
  })
  participantId?: number

  @ApiModelProperty()
  @ManyToOne(type => MatchEntity, match => match.idMatch)
  @JoinColumn({
    name: 'match'
  })
  match?: number | MatchEntity

  @ApiModelProperty()
  @OneToOne(type => SummonerContextEntity, summoner => summoner.idSummoner, { cascade: true })
  @JoinColumn({
    name: 'summoner'
  })
  summoner?: number | SummonerContextEntity
}
