import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { ApiResponseModelProperty as ApiModelProperty } from '@nestjs/swagger'
import { Regions } from 'api-riot-games/dist/constants'

@Entity()
export class SummonerEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  idSummoner?: number

  @ApiModelProperty()
  @Column({ type: 'int' })
  profileIconId: number

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  name: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  puuid: string

  @ApiModelProperty()
  @Column({ type: 'double' })
  summonerLevel: number

  @ApiModelProperty()
  @Column({ type: 'double' })
  revisionDate: number

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  id: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  accountId: string

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  region: Regions

  @ApiModelProperty({ example: new Date().toISOString() })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createAt?: Date

  @ApiModelProperty({ example: new Date().toISOString() })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updateAt?: Date
}
