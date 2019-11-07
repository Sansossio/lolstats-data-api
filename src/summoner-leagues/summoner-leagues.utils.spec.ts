import { romanToInt, riotToModel } from './summoner-leagues.utils'
import { SummonerLeagueDto } from 'twisted/dist/dto'

describe('Summoner leagues utils', () => {
  describe('Roman numbers', () => {
    it('should return roman to number converted', () => {
      // We only need 1 - 5
      expect(romanToInt('I')).toEqual(1)
      expect(romanToInt('II')).toEqual(2)
      expect(romanToInt('III')).toEqual(3)
      expect(romanToInt('IV')).toEqual(4)
      expect(romanToInt('V')).toEqual(5)
    })

    it('should return number as parameter and should return same number', () => {
      expect(romanToInt(1)).toEqual(1)
      expect(romanToInt(0)).toEqual(0)
      expect(romanToInt(-1)).toEqual(-1)
    })
  })

  describe('Riot model mapper', () => {
    const exampleLeague: SummonerLeagueDto = {
      queueType: 'string',
      summonerName: 'string',
      hotStreak: false,
      wins: 0,
      veteran: false,
      losses: 0,
      rank: 'I',
      leagueId: 'string',
      inactive: false,
      freshBlood: false,
      tier: 'string',
      summonerId: 'string',
      leaguePoints: 0
    }

    it('should return an empty array', () => {
      const response = riotToModel([])
      expect(response).toEqual([])
    })

    it('should convert instance to array', () => {
      const response = riotToModel(exampleLeague)
      expect(response.length).toEqual(1)
    })

    it('should return multi instances', () => {
      const response = riotToModel([exampleLeague, exampleLeague])
      expect(response.length).toEqual(2)
    })

    it('should convert rank string to number', () => {
      exampleLeague.rank = 'I'
      const [response] = riotToModel(exampleLeague)
      expect(response.rank).toEqual(1)
    })

    it('should convert rank string to number and map summoner', () => {
      exampleLeague.rank = 'II'
      const summoner = '123'
      const [response] = riotToModel(exampleLeague, summoner)
      expect(response.rank).toEqual(2)
      expect(response.summoner).toEqual(summoner)
    })
  })
})
