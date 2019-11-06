import { Logger } from '@nestjs/common'
import { CacheMessages } from '../enums/cache.enum'
import { version } from '../../package.json'

export function serviceDisabled () {
  return Logger.warn(
    CacheMessages.DISCONNECTED,
    CacheMessages.CONTEXT
  )
}

export function generateKey (className, propertyName, args) {
  const key =
    [
      version,
      className,
      propertyName,
      ...args.map(a => JSON.stringify(a))
    ].join()
  return key
}

export function redisIsAvailable (client: any) {
  return !!(client && client.connected)
}

export function tryQuit (client: any) {
  if (!client) {
    return false
  }
  client.quit()
  exports.serviceDisabled()
  return true
}
