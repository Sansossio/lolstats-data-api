import { CacheService } from './cache.service'
import { version } from '../../package.json'

const service = new CacheService()

export interface ICacheParams {
  expiration?: number
}
/**
 * Cache decorator
 * @param expiration Expiration in seconds
 */
export function Cache (params: ICacheParams = {}) {
  const {
    expiration
  } = params
  return function (
    target: Object,
    propertyName: string,
    propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method = propertyDesciptor.value
    propertyDesciptor.value = async function (...args: any[]) {
      // Create unique key
      const key =
        [
          version,
          propertyName,
          ...args.map(a => JSON.stringify(a))
        ].join()
      // Find in redis
      const cacheValue = await service.get(key)
      if (cacheValue) {
        return cacheValue
      }
      // Default response
      const result = await method.apply(this, args)

      // Set
      service.set(key, result, expiration)

      return result
    }
    return propertyDesciptor
  }
}
