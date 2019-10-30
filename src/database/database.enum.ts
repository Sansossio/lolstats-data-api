import { SchemaOptions } from 'mongoose'

export enum ModelsName {
  SUMMONER = 'summoners',
  SUMMONER_LEAGUES = 'summoner_leagues'
}

export const ModelsOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false
}
