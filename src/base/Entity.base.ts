import { Model, Table, Column } from 'sequelize-typescript'

@Table({
  timestamps: true
})
export class BaseEntity extends Model<BaseEntity> {
  @Column
  createdAt?: Date

  @Column
  updatedAt?: Date
}
