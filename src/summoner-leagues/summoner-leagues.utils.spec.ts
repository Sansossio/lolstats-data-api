import { romanToInt } from './summoner-leagues.utils'

describe('Summoner leagues utils', () => {
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
