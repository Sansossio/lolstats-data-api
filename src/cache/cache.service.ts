import { Injectable } from '@nestjs/common'
import * as Redis from 'redis'
import { ConfigService } from '../config/config.service'

@Injectable()
export class CacheService {
  private client?: Redis.RedisClient
  private readonly config = new ConfigService()
  private readonly defaultExpiration = this.config.getNumber('redis.defaultExpiration')

  constructor () {
    const available = this.config.getBoolean('redis.enable')
    const url = this.config.get<string>('redis.url')

    if (available) {
      this.client = Redis.createClient({ url })
    }
  }

  private redisIsAvailable () {
    return this.client && this.client.connected
  }

  // Public
  async get<T> (key: string) {
    if (!this.redisIsAvailable()) {
      return
    }
    const client = this.client as Redis.RedisClient
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
    if (!this.redisIsAvailable()) {
      return
    }
    const client = this.client as Redis.RedisClient
    const parsedValue = JSON.stringify(value)
    const command = 'EX' // Expiration
    return new Promise<void>((resolve, reject) => {
      client.set(
        key,
        parsedValue,
        command,
        expiration || this.defaultExpiration,
        (err) => {
          if (err) reject(err)
          else resolve()
        })
    })
  }
}
