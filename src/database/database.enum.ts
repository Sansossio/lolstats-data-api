import { SchemaOptions } from 'mongoose'

export enum ModelsName {
  SUMMONER = 'summoners',
  SUMMONER_LEAGUES = 'summoner_leagues',
  TFT_MATCH = 'tft_matches'
}

export const ModelsOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false
}
