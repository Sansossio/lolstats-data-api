const RomanNumerals = require('js-roman-numerals')

export function romanToInt (roman: string): number {
  return +new RomanNumerals(roman).toInt()
}
