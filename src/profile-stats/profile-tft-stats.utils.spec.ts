import * as utils from './profile-tft-stats.utils'
import { NotFoundException } from '@nestjs/common'

describe('Basic tft stats utils', () => {
  const puuid = '123'

  describe('Filter by trait', () => {
    const trait = 'demon'
    it('should catch error when participants doesn\'t exists', () => {
      const matches = [
        {
        }
      ]
      expect(() => utils.FilterByTrait(trait, puuid, matches))
        .toThrowError(NotFoundException)
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
      const result = utils.FilterByTrait(trait, puuid, [match])
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
      const result = utils.FilterByTrait(trait, puuid, [match])
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
      const result = utils.FilterByTrait(trait, puuid, [match, match])
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
      const result = utils.FilterByTrait(trait, puuid, [match, match])
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
      const result = utils.FilterByTrait(trait, puuid, [match, match])
      expect(result.length).toEqual(0)
    })
  })

  describe('Filter by item', () => {
    it('should catch error when participants doesn\'t exists', () => {
      const matches = [
        {
        }
      ]
      expect(() => utils.FilterByItem(0, puuid, matches))
        .toThrowError(NotFoundException)
    })

    it('should return matches filtered (length: 1)', () => {
      const match = {
        participants: [
          {
            summoner: { puuid },
            units: [
              {
                items: [
                  {
                    id: 1
                  }
                ]
              }
            ]
          }
        ]
      }
      const result = utils.FilterByItem(1, puuid, [match])
      expect(result.length).toEqual(1)
    })

    it('should return matches filtered when units key doesnt exists (length: 0)', () => {
      const match = {
        participants: [
          {
            summoner: { puuid }
          }
        ]
      }
      const result = utils.FilterByItem(1, puuid, [match])
      expect(result.length).toEqual(0)
    })

    it('should return matches filtered when one of them doesnt has items key(length: 1)', () => {
      const match = {
        participants: [
          {
            summoner: { puuid },
            units: [
              {
                items: [
                  {
                    id: 1
                  }
                ]
              },
              {
              }
            ]
          }
        ]
      }
      const result = utils.FilterByItem(1, puuid, [match])
      expect(result.length).toEqual(1)
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
      const result = utils.ObjectResponse(puuid, [match])
      expect(result.games).toEqual(1)
      expect(result).toHaveProperty('games')
      expect(result).toHaveProperty('averages')
      expect(result).toHaveProperty('placements')
      expect(result).toHaveProperty('mostUsed')
    })
  })
})
