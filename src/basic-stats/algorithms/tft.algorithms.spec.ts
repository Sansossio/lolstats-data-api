import {
  isWin, findSummoner, winrate, getQueues, playersElimited, keyAverage
} from './tft'
import { TftMatchEnum } from '../../enums/tft-match.enum'

describe('Tft algorithms', () => {
  describe('IsWin', () => {
    const minWin = TftMatchEnum.PLACEMENT_WIN

    it('should return false when param is undefined', () => {
      expect(isWin()).toEqual(false)
    })

    it(`should return true when param is lower than ${minWin}`, () => {
      expect(isWin(3)).toEqual(true)
    })

    it(`should return true when param is equal to ${minWin}`, () => {
      expect(isWin(4)).toEqual(true)
    })

    it(`should return false when param is greater than ${minWin}`, () => {
      expect(isWin(5)).toEqual(false)
    })
  })

  describe('FindSummoner', () => {
    it('should return error when summoner doesn\'t exists', done => {
      const puuid = '123'
      const participants = []
      try {
        findSummoner(puuid, participants)
        done(new Error())
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        done()
      }
    })

    it('should return error when summoner doesn\'t has a puuid', done => {
      const puuid = '123'
      const participants = [{ summoner: {} }]
      try {
        findSummoner(puuid, participants)
        done(new Error())
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        done()
      }
    })

    it('should return the user filtered', () => {
      const puuid = '123'
      const participants = [
        {
          summoner: {
            puuid
          }
        },
        {
          summoner : {
            puuid: '12'
          }
        }
      ]
      const summoner = findSummoner(puuid, participants)
      expect(summoner).toEqual({ summoner: { puuid } })
    })
  })

  describe('Winrate', () => {
    it('should return 100% winrate percent', () => {
      const puuid = '123'
      const matches = [
        {
          participants: [
            {
              placement: 1,
              summoner: {
                puuid
              }
            }
          ]
        }
      ]
      const percentage = winrate(puuid, matches)
      expect(percentage).toEqual(100)
    })

    it('should return 0% winrate percent', () => {
      const puuid = '123'
      const matches = [
        {
          participants: [
            {
              placement: 5,
              summoner: {
                puuid
              }
            }
          ]
        }
      ]
      const percentage = winrate(puuid, matches)
      expect(percentage).toEqual(0)
    })

    it('should return 33.33% winrate percent', () => {
      const puuid = '123'
      const matches = [
        {
          participants: [
            {
              placement: 5,
              summoner: {
                puuid
              }
            }
          ]
        },
        {
          participants: [
            {
              placement: 5,
              summoner: {
                puuid
              }
            }
          ]
        },
        {
          participants: [
            {
              placement: 1,
              summoner: {
                puuid
              }
            }
          ]
        }
      ]
      const percentage = winrate(puuid, matches)
      expect(percentage).toEqual(1 / 3 * 100)
    })
  })

  describe('GetQueues', () => {
    it('should return only global queue', () => {
      const matches = []
      const queues = getQueues(matches)
      expect(queues).toEqual([TftMatchEnum.STATS_TOTAL])
    })

    it('should return list of queues', () => {
      const matches = [
        {
          queue: {
            queueId: 0
          }
        },
        {
          queue: {
            queueId: 1
          }
        }
      ]
      const queues = getQueues(matches)
      expect(queues).toEqual([TftMatchEnum.STATS_TOTAL, '0', '1'])
    })

    it('should return list of queues when someone of them hasn\'t queue field', () => {
      const matches = [
        {
          queue: {
            queueId: 0
          }
        },
        {
          queue: undefined
        }
      ]
      const queues = getQueues(matches)
      expect(queues).toEqual([TftMatchEnum.STATS_TOTAL, '0'])
    })
  })

  describe('PlayersElimited', () => {
    it('should return zero elimited players', () => {
      const puuid = '213'
      const matches = []
      const players = playersElimited(puuid, matches)
      expect(players).toEqual(0)
    })

    it('should return 1 elimited players', () => {
      const puuid = '213'
      const matches = [
        {
          participants: [
            {
              players_eliminated: 1,
              summoner: {
                puuid
              }
            },
            {
              players_eliminated: 1,
              summoner: {
                puuid: '123'
              }
            }
          ]
        }
      ]
      const players = playersElimited(puuid, matches)
      expect(players).toEqual(1)
    })

    it('should return 20 elimited players (multiple matches)', () => {
      const puuid = '213'
      const match = {
        participants: [
          {
            players_eliminated: 10,
            summoner: {
              puuid
            }
          },
          {
            players_eliminated: 1,
            summoner: {
              puuid: '123'
            }
          }
        ]
      }
      const matches = [match, match]
      const players = playersElimited(puuid, matches)
      expect(players).toEqual(20)
    })

    it('should return error when elimited players is lower than 0', done => {
      const puuid = '213'
      const matches = [
        {
          participants: [
            {
              players_eliminated: -1,
              summoner: {
                puuid
              }
            },
            {
              players_eliminated: 1,
              summoner: {
                puuid: '123'
              }
            }
          ]
        }
      ]
      try {
        playersElimited(puuid, matches)
        done(new Error())
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        done()
      }
    })
  })

  describe('Key average', () => {
    it('should return a valid sum of key', () => {
      const puuid = '123'
      const match = {
        participants: [
          {
            gold_left: 1
          },
          {
            gold_left: 2,
            summoner: {
              puuid
            }
          }
        ]
      }
      const matches = [match, match]
      const result = keyAverage(puuid, matches, 'gold_left')
      const sumExpected = 4
      expect(result).toEqual(sumExpected / matches.length)
    })
  })
})
