import { SummonerEntity } from '../database/entities/entities/summoner.entity'
import Regions from '../enum/regions.enum'

export enum SummonerUtilsEnum {
  BOT_TAG = '0',
  BOT_NAME = 'Bot'
}

export function isBot (accountId: string | undefined) {
  return accountId === SummonerUtilsEnum.BOT_TAG
}

export function parseAccountId (accountId: string) {
  if (isBot(accountId)) {
    return undefined
  }
  return accountId
}

export function baseInstance (instance: Partial<SummonerEntity> & { region: Regions }): SummonerEntity {
  const base = new SummonerEntity()
  const object = {
    ...instance,
    id: instance.id || 0,
    leagues: instance.leagues || [],
    name: instance.name || SummonerUtilsEnum.BOT_NAME,
    profileIconId: instance.profileIconId || 0,
    region: instance.region
  }
  return Object.assign(base, object)
}
