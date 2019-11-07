import { SummonerLeagueDto } from 'twisted/dist/dto'
import { ISummonerLeagueModel } from './models/summoner-leagues.interface'
import { castArray } from 'lodash'

const RomanNumerals = require('js-roman-numerals')

export function romanToInt (roman: string | number): number {
  if (typeof roman === 'number') {
    return roman
  }
  return +new RomanNumerals(roman).toInt()
}

export function riotToModel (leagues: SummonerLeagueDto | SummonerLeagueDto[], summoner?: string): ISummonerLeagueModel[] {
  const response: ISummonerLeagueModel[] = []
  for (const item of castArray(leagues)) {
    const createItem = {
      ...item,
      rank: romanToInt(item.rank),
      summoner: summoner
    }
    response.push(createItem as ISummonerLeagueModel)
  }
  return response
}
