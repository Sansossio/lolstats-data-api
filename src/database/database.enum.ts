import { SchemaOptions } from 'mongoose'

export const ModelsEnum = {
  SUMMONER: {
    name: 'SUMMONER',
    collection: 'summoners'
  }
}

export const ModelsOptions: SchemaOptions = {
  timestamps: true
}
