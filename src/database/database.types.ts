import { Schema } from 'mongoose'

export interface IModels {
  name: string
  schema: Schema
  collection: string
}
