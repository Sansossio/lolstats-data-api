import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SummonerContextEntity } from '../../summoner/summoner.entity'
import { ApiModelProperty } from '@nestjs/swagger'
import { BaseEntity } from '../../base/Entity.base'

@Entity('summoner_matches')
export class SummonerMatchesEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  idSummonerMatch?: number

  @ApiModelProperty()
  @Column({ type: 'int' })
  gameId!: number

  @ApiModelProperty({
    example: new Date().toISOString()
  })
  @Column({ type: 'timestamp' })
  creation!: Date

  @ApiModelProperty()
  @Column({ type: 'int' })
  duration!: number

  @ApiModelProperty()
  @Column({ type: 'int' })
  queueId!: number

  @ApiModelProperty()
  @Column({ type: 'int' })
  mapId!: number

  @ApiModelProperty()
  @Column({ type: 'int' })
  seasonId!: number

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  version!: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  mode!: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  type!: string

  @ManyToOne(type => SummonerContextEntity, summoner => summoner.idSummoner)
  @JoinColumn({
    name: 'idSummoner'
  })
  idSummoner?: number
}
