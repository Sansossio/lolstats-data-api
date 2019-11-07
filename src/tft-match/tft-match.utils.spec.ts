import * as utils from './tft-match.utils'
import { Regions } from 'twisted/dist/constants'

describe('Tft match utils', () => {
  describe('Get search params', () => {
    const summonerName = 'hide on bush'
    const region = Regions.KOREA
    it('should return a valid search params', () => {
      const limit = 10
      const page = 0
      const params = {
        limit,
        page,
        summonerName,
        region
      }
      const id = '123'
      const response = utils.getSearchParams(params, id)

      expect(response.skip).toEqual(limit * page)
      expect(response.requestLimit).toEqual((limit * page) + limit)
    })
  })

  describe('Parse participants ids', () => {
    it('should return ids listing', () => {
      const users = [
        {
          _id: '1'
        },
        {
          _id: '2'
        }
      ]
      const response = utils.parseParticipantsIds(users)
      expect(response).toEqual(['1', '2'])
    })

    it('should return empty array', () => {
      const users = []
      const response = utils.parseParticipantsIds(users)
      expect(response).toEqual([])
    })
  })
})
