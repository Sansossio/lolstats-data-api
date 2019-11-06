import { Injectable } from '@nestjs/common'
import * as Redis from 'redis'
import { ConfigService } from '../config/config.service'
import { CacheTimes } from '../enums/cache.enum'
import * as utils from './cache.utils'

@Injectable()
export class CacheService {
  private client?: Redis.RedisClient
  private readonly config = new ConfigService()

  constructor () {
    const available = this.config.getBoolean('redis.enable')
    const url = this.config.get<string>('redis.url')

    if (available) {
      this.client = Redis.createClient({ url })
      this.client.on('error', () => utils.tryQuit(this.client))
    } else {
      utils.serviceDisabled()
    }
  }

  private getClient () {
    return this.client as Redis.RedisClient
  }

  async get<T> (key: string) {
    if (!utils.redisIsAvailable(this.client)) {
      return
    }
    const client = this.getClient()
    return new Promise<T>((resolve, reject) => {
      client.get(key, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        const value = JSON.parse(result)
        resolve(value)
      })
    })
  }

  async set<T> (key: string, value: T, expiration?: number): Promise<void> {
    if (!utils.redisIsAvailable(this.client)) {
      return
    }
    const parsedValue = JSON.stringify(value)
    const client = this.getClient()
    return new Promise<void>((resolve, reject) => {
      client.setex(
        key,
        expiration || CacheTimes.DEFAULT,
        parsedValue,
        (err) => {
          if (err) reject(err)
          else resolve()
        })
    })
  }
}
