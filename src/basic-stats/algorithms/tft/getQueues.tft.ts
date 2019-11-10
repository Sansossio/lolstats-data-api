import { ITFTMatchModel } from '../../../tft-match/models/match/tft-match.interface'

export function getQueues (matches: Partial<ITFTMatchModel>[]) {
  return matches.reduce<number[]>((prev, curr) => {
    if (!curr.queue || typeof curr.queue.queueId !== 'number') {
      return prev
    }
    const name = curr.queue.queueId
    const exists = !!prev.find(cName => cName === name)
    if (exists) {
      return prev
    }
    prev.push(name)
    return prev
  }, [])
}
