import { Injectable, Inject } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { DatabaseEnum } from './database.enum'
import { Transaction } from 'sequelize/types'

@Injectable()
export class DatabaseService {
  constructor (
    @Inject(DatabaseEnum.CONTEXT)
    private readonly connection: Sequelize
  ) {}

  async getTransaction (transaction?: Transaction) {
    return transaction || this.connection.transaction()
  }
}
