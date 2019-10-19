import { config } from 'dotenv'
config()

export default {
  database: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['{src,dist}/**/**.entity{.ts,.js}'],
    synchronize: true,
    logging: false
  },
  riot: {
    apiKey: process.env.RIOT_API_KEY,
    rateLimitRetry: process.env.RATE_LIMIT_RETRY,
    rateLimitCount: process.env.RATE_LIMIT_COUNT
  }
}
