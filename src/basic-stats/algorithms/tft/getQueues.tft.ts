import { ITFTMatchModel } from '../../../tft-match/models/match/tft-match.interface'
import { TftMatchEnum } from '../../../enums/tft-match.enum'

export function getQueues (matches: Partial<ITFTMatchModel>[]) {
  return matches.reduce<string[]>((prev, curr) => {
    const name = String(curr.queue && curr.queue.queueId || 0)
    const exists = !!prev.find(cName => cName === name)
    if (exists) {
      return prev
    }
    prev.push(name)
    return prev
  }, [TftMatchEnum.STATS_GLOBAL as string])
}
