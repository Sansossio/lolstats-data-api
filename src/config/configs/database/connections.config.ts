import { config } from 'dotenv'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

config()

export interface IDatabaseConnection {
  [key: string]: TypeOrmModuleOptions
}

export const databaseConnections: IDatabaseConnection = {
  context: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['{src,dist}/**/**.entity{.ts,.js}'],
    synchronize: true,
    logging: false
  }
}
