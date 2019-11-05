import { Logger } from '@nestjs/common'
import { CacheMessages } from '../enums/cache.enum'

export function serviceDisabled () {
  Logger.warn(
    CacheMessages.DISCONNECTED,
    CacheMessages.CONTEXT
  )
}
