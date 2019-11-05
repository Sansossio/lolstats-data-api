import {
  isWin,
  findSummoner,
  winrate,
  getQueues,
  playersEliminated,
  keyAverage,
  mostUsedTraits,
  mostUsedUnits,
  getTraits,
  percentagePerPlacement
} from './tft'
import { TftMatchEnum } from '../../enums/tft-match.enum'

describe('Tft algorithms', () => {
  const puuid = '123'

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

  describe('Percentage per placement', () => {
    it('should return error when participants doesn\'t exists', done => {
      const matches = [
        {
        }
      ]
      try {
        percentagePerPlacement(puuid, matches)
        done(new Error())
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        done()
      }
    })

    it('should response unique placement 100%', () => {
      const match = {
        participants: [
          {
            summoner: { puuid },
            placement: 1
          }
        ]
      }
      const [result] = percentagePerPlacement(puuid, [match])
      expect(result).toEqual({ placement: 1, percentage: 100, total: 1 })
    })

    it('should response placements (2/3)%', () => {
      const matches = [
        {
          participants: [
            {
              summoner: { puuid },
              placement: 1
            }
          ]
        },
        {
          participants: [
            {
              summoner: { puuid },
              placement: 1
            }
          ]
        },
        {
          participants: [
            {
              summoner: { puuid },
              placement: 3
            }
          ]
        }
      ]
      const [result] = percentagePerPlacement(puuid, matches)
      expect(result).toEqual({ placement: 1, percentage: 2 / 3 * 100, total: 1 })
    })

    it('should response empty placements when placement is undefined', () => {
      const matches = [
        {
          participants: [
            {
              summoner: { puuid }
            }
          ]
        }
      ]
      const result = percentagePerPlacement(puuid, matches)
      expect(result).toEqual([])
    })
  })

  describe('FindSummoner', () => {
    it('should return error when summoner doesn\'t exists', done => {
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
      const participants = [
        {
          summoner: {
            puuid
          }
        },
        {
          summoner: {
            puuid: '12'
          }
        }
      ]
      const summoner = findSummoner(puuid, participants)
      expect(summoner).toEqual({ summoner: { puuid } })
    })
  })

  describe('Winrate', () => {
    it('should return error when participants doesn\'t exists', done => {
      const matches = [
        {
        }
      ]
      try {
        winrate(puuid, matches)
        done(new Error())
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        done()
      }
    })

    it('should return 100% winrate percent', () => {
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

  describe('GetTraits', () => {
    it('should return error when participants doesn\'t exists', done => {
      const matches = [
        {
        }
      ]
      try {
        getTraits(puuid, matches)
        done(new Error())
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        done()
      }
    })

    it('should return an empty array', () => {
      const matches = []
      const queues = getTraits(puuid, matches)
      expect(queues).toEqual([])
    })

    it('should return list of traits', () => {
      const matches = [
        {
          participants: [
            {
              traits: [
                {
                  name: 'Demon',
                  tier_current: 1
                }
              ],
              summoner: {
                puuid
              }
            }
          ]
        },
        {
          participants: [
            {
              summoner: {
                puuid
              }
            }
          ]
        }
      ]
      const queues = getTraits(puuid, matches)
      expect(queues).toEqual(['Demon'])
    })

    it('should return list of traits (multiple)', () => {
      const matches = [
        {
          participants: [
            {
              traits: [
                {
                  name: 'Demon',
                  tier_current: 1
                },
                {}
              ],
              summoner: {
                puuid
              }
            }
          ]
        },
        {
          participants: [
            {
              summoner: {
                puuid
              }
            }
          ]
        }
      ]
      const queues = getTraits(puuid, matches)
      expect(queues).toEqual(['Demon'])
    })
  })

  describe('PlayersEliminated', () => {
    it('should return error when participants doesn\'t exists', done => {
      const matches = [
        {
        }
      ]
      try {
        playersEliminated(puuid, matches)
        done(new Error())
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        done()
      }
    })

    it('should return zero Eliminated players', () => {
      const matches = []
      const players = playersEliminated(puuid, matches)
      expect(players).toEqual(0)
    })

    it('should return 1 Eliminated players', () => {
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
      const players = playersEliminated(puuid, matches)
      expect(players).toEqual(1)
    })

    it('should return 0 when key doesn\'t exists', () => {
      const matches = [
        {
          participants: [
            {
              summoner: {
                puuid
              }
            },
            {
              summoner: {
                puuid: '123'
              }
            }
          ]
        }
      ]
      const players = playersEliminated(puuid, matches)
      expect(players).toEqual(0)
    })

    it('should return 20 Eliminated players (multiple matches)', () => {
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
      const players = playersEliminated(puuid, matches)
      expect(players).toEqual(20)
    })

    it('should return error when Eliminated players is lower than 0', done => {
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
        playersEliminated(puuid, matches)
        done(new Error())
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        done()
      }
    })
  })

  describe('Key average', () => {
    it('should return error when participants is undefined', done => {
      const match = {
        participants: undefined
      }
      try {
        keyAverage(puuid, [match], 'gold_left')
        done(new Error())
      } catch (e) {
        done()
      }
    })

    it('should return a valid sum of key', () => {
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

    it('should return 0 when the key doesn\'t exists', () => {
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
      const result = keyAverage(puuid, matches, 'gold_lefts')
      const sumExpected = 0
      expect(result).toEqual(0)
    })
  })

  describe('Most used traits', () => {
    it('should return error when participants doesn\'t exists', done => {
      const matches = [
        {
        }
      ]
      try {
        mostUsedTraits(puuid, matches)
        done(new Error())
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        done()
      }
    })

    it('should return error when traits key doesn\'t exists', done => {
      const matches = [
        {
          participants: [
            {
              summoner: { puuid }
            }
          ]
        }
      ]
      try {
        mostUsedTraits(puuid, matches)
        done(new Error())
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        done()
      }
    })

    it('should return an empty array when matches.length is zero', () => {
      const matches = []
      const result = mostUsedTraits(puuid, matches)
      expect(result).toEqual([])
    })

    it('should return a simple traits most used array (empty name and num_units)', () => {
      const match = {
        participants: [
          {
            summoner: { puuid },
            traits: [
              {
              }
            ]
          }
        ]
      }
      const matches = [match, match]
      const result = mostUsedTraits(puuid, matches)
      const totalTraits = result.reduce<number>((prev, curr) => {
        prev += curr.num_units
        return prev
      }, 0)
      expect(totalTraits).toEqual(0)
    })

    it('should return a simple traits most used array', () => {
      const match = {
        participants: [
          {
            summoner: { puuid },
            traits: [
              {
                name: 'Pirate',
                num_units: 1
              }
            ]
          }
        ]
      }
      const matches = [match, match]
      const result = mostUsedTraits(puuid, matches)
      const totalPirates = result.reduce<number>((prev, curr) => {
        prev += curr.num_units
        return prev
      }, 0)
      expect(totalPirates).toEqual(2)
    })

    it('should return a ordered traits array', () => {
      const matches = [
        {
          participants: [
            {
              summoner: { puuid },
              traits: [
                {
                  name: 'Pirate',
                  num_units: 1
                }
              ]
            }
          ]
        },
        {
          participants: [
            {
              summoner: { puuid },
              traits: [
                {
                  name: 'Pirate',
                  num_units: 1
                },
                {
                  name: 'Sorcerrer',
                  num_units: 1
                }
              ]
            }
          ]
        }
      ]
      const result = mostUsedTraits(puuid, matches)
      const expected = [
        {
          name: 'Pirate',
          num_units: 2,
          games: 2
        },
        {
          name: 'Sorcerrer',
          num_units: 1,
          games: 1
        }
      ]
      expect(result).toEqual(expected)
    })
  })

  describe('Most used units', () => {
    it('should return error when participants doesn\'t exists', done => {
      const matches = [
        {
        }
      ]
      try {
        mostUsedUnits(puuid, matches)
        done(new Error())
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        done()
      }
    })

    it('should return error when units key doesn\'t exists', done => {
      const matches = [
        {
          participants: [
            {
              summoner: { puuid }
            }
          ]
        }
      ]
      try {
        mostUsedUnits(puuid, matches)
        done(new Error())
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        done()
      }
    })

    it('should return an empty array when matches.length is zero', () => {
      const matches = []
      const result = mostUsedUnits(puuid, matches)
      expect(result).toEqual([])
    })

    it('should return a simple units most used array', () => {
      const match = {
        participants: [
          {
            summoner: { puuid },
            units: [
              {
                name: 'Twisted',
                character_id: '1',
                num_units: 1
              }
            ]
          }
        ]
      }
      const matches = [match, match]
      const result = mostUsedUnits(puuid, matches)
      const totalTwisted = result.reduce<number>((prev, curr) => {
        prev += curr.games
        return prev
      }, 0)
      expect(totalTwisted).toEqual(2)
    })

    it('should return a ordered units array', () => {
      const matches = [
        {
          participants: [
            {
              summoner: { puuid },
              units: [
                {
                  name: 'Twisted',
                  character_id: '1'
                }
              ]
            }
          ]
        },
        {
          participants: [
            {
              summoner: { puuid },
              units: [
                {
                  name: 'Twisted',
                  character_id: '1'
                },
                {
                  name: 'Aurelion',
                  character_id: '2'
                }
              ]
            }
          ]
        }
      ]
      const result = mostUsedUnits(puuid, matches)
      const expected = [
        {
          name: 'Twisted',
          character_id: '1',
          games: 2
        },
        {
          name: 'Aurelion',
          character_id: '2',
          games: 1
        }
      ]
      expect(result).toEqual(expected)
    })
  })
})
