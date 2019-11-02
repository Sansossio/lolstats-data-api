import { SchemaOptions } from 'mongoose'

export enum ModelsName {
  SUMMONER = 'summoners',
  SUMMONER_LEAGUES = 'summoner_leagues',
  TFT_MATCH = 'tft_matches',
  STATIC_QUEUES = 'static_queues',
  STATIC_SEASONS = 'static_seasons'
}

export const ModelsOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false
}
