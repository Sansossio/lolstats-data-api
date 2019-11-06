import * as utils from './basic-stats.utils'
import { NotFoundException } from '@nestjs/common'

describe('Basic stats utils', () => {
  describe('Tft', () => {
    const puuid = '123'

    describe('Filter by trait', () => {
      const trait = 'demon'
      it('should return error when participants doesn\'t exists', done => {
        const matches = [
          {
          }
        ]
        try {
          utils.filterByTrait(trait, puuid, matches)
          done(new Error())
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException)
          done()
        }
      })

      it('should return matches filtered (length: 1)', () => {
        const match = {
          participants: [
            {
              summoner: { puuid },
              traits: [
                {
                  name: trait,
                  tier_current: 1
                }
              ]
            }
          ]
        }
        const result = utils.filterByTrait(trait, puuid, [match])
        expect(result.length).toEqual(1)
      })

      it('should return matches filtered (length: 0)', () => {
        const match = {
          participants: [
            {
              summoner: { puuid },
              traits: [
                {
                  name: 'Pirate',
                  tier_current: 1
                }
              ]
            }
          ]
        }
        const result = utils.filterByTrait(trait, puuid, [match])
        expect(result.length).toEqual(0)
      })

      it('should return matches filtered (length: 2)', () => {
        const match = {
          participants: [
            {
              summoner: { puuid },
              traits: [
                {
                  name: trait,
                  tier_current: 1
                }
              ]
            }
          ]
        }
        const result = utils.filterByTrait(trait, puuid, [match, match])
        expect(result.length).toEqual(2)
      })

      it('should return 0 matches when traits is undefined', () => {
        const match = {
          participants: [
            {
              summoner: { puuid }
            }
          ]
        }
        const result = utils.filterByTrait(trait, puuid, [match, match])
        expect(result.length).toEqual(0)
      })

      it('should return 0 matches when trait is has tier_current equal to 0', () => {
        const match = {
          participants: [
            {
              summoner: { puuid },
              tiers: [
                {
                  name: trait,
                  tier_current: 0
                }
              ]
            }
          ]
        }
        const result = utils.filterByTrait(trait, puuid, [match, match])
        expect(result.length).toEqual(0)
      })
    })

    describe('Object response', () => {
      it('should return a valid response', () => {
        const match = {
          participants: [
            {
              units: [],
              traits: [],
              summoner: { puuid }
            }
          ]
        }
        const result = utils.objectResponse(puuid, [match])
        expect(result.games).toEqual(1)
        expect(result).toHaveProperty('games')
        expect(result).toHaveProperty('averages')
        expect(result).toHaveProperty('global')
        expect(result).toHaveProperty('placements')
        expect(result).toHaveProperty('mostUsed')
      })
    })
  })
})
