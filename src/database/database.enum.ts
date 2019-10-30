import { SchemaOptions } from 'mongoose'

export const ModelsEnum = {
  SUMMONER: {
    name: 'summoners'
  }
}

export const ModelsOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false
}
