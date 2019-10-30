import { config } from 'dotenv'

config()

export default {
  riot: {
    apiKey: process.env.RIOT_API_KEY,
    rateLimitRetry: process.env.RATE_LIMIT_RETRY,
    rateLimitCount: process.env.RATE_LIMIT_COUNT
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dbname: process.env.DATABASE_DBNAME
  }
}
