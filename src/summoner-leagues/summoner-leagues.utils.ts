const RomanNumerals = require('js-roman-numerals')

export function romanToInt (roman: string | number): number {
  if (typeof roman === 'number') {
    return roman
  }
  return +new RomanNumerals(roman).toInt()
}
