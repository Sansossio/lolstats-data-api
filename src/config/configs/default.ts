import { config } from 'dotenv'
config()

export default {
  riot: {
    apiKey: process.env.API_KEY,
    rateLimitRetry: process.env.RATE_LIMIT_RETRY,
    rateLimitCount: process.env.RATE_LIMIT_COUNT
  }
}
