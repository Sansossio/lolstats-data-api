import { BaseEntity } from '../../base/Entity.base'
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
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
  @ManyToOne(type => MatchEntity, match => match.idMatch)
  @JoinColumn({
    name: 'match'
  })
  match?: number | MatchEntity

  @ApiModelProperty()
  @ManyToOne(type => SummonerContextEntity, summoner => summoner.idSummoner)
  @JoinColumn({
    name: 'summoner'
  })
  summoner?: number | SummonerContextEntity
}
