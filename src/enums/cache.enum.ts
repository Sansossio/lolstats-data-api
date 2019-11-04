const ms = require('ms')

export enum CacheTimes {
  SUMMONER = ms('2h'),
  TFT_MATCH_DETAILS = ms('10d'),
  TFT_MATCH_LISTING = ms('20m'),
  DEFAULT = ms('1h')
}
