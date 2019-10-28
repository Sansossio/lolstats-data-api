import { config } from 'dotenv'
import { getEntitiesPath } from './database.config.utils'
import { Sequelize } from 'sequelize-typescript'
import { allProviders } from '../../../entities/exportProviders'

config()

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      })
      sequelize.addModels(allProviders.map(v => v.useValue))
      await sequelize.sync()
      return sequelize
    }
  }
]
