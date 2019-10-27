import { BaseEntity } from '../../base/Entity.base'
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Index } from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger'
import { MatchEntity } from './match.entity'
import { SummonerContextEntity } from '../../summoner/summoner.entity'

export const matchParticipantsName = 'match_participants'

@Entity(matchParticipantsName)
@Index('index_summoner_match', ['summoner', 'match'], { unique: true })
export class MatchParticipantsEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  idMatchParticipant?: number = 0

  @ApiModelProperty()
  @Column()
  participantId?: number

  @ApiModelProperty()
  @ManyToOne(type => MatchEntity, match => match.idMatch, { nullable: false })
  @JoinColumn({
    name: 'match'
  })
  match?: number | MatchEntity

  @ApiModelProperty()
  @ManyToOne(type => SummonerContextEntity, summoner => summoner.idSummoner, { nullable: false })
  @JoinColumn({
    name: 'summoner'
  })
  summoner?: number | SummonerContextEntity
}
