import { config } from 'dotenv'

config()

export default {
  riot: {
    apiKey: process.env.RIOT_API_KEY,
    rateLimitRetry: process.env.RATE_LIMIT_RETRY,
    rateLimitCount: process.env.RATE_LIMIT_COUNT
  },
  update: {
    userUpdateIntervalMin: 1
  },
  cron: {
    match: {
      details: {
        limit: 5
      }
    },
    summoner: {
      details: {
        limit: 1
      }
    }
  }
}
