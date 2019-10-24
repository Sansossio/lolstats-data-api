import { Entity, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger'

@Entity()
export class BaseEntity {
  @ApiModelProperty({ example: new Date().toISOString() })
  @CreateDateColumn()
  createAt?: Date

  @ApiModelProperty({ example: new Date().toISOString() })
  @UpdateDateColumn()
  updateAt?: Date
}
