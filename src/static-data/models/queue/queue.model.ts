import * as mongoose from 'mongoose'
import { ModelsOptions, ModelsName } from '../../../enums/database.enum'
import { IModels } from '../../../database/database.types'
// Schema definition
const schema = new mongoose.Schema({
  queueId: {
    type: Number,
    required: true
  },

  map: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: false
  },

  notes: {
    type: String,
    required: false
  }
}, ModelsOptions)

// Model definition
export const QueueModel: IModels = {
  name: ModelsName.STATIC_QUEUES,
  collection: ModelsName.STATIC_QUEUES,
  schema: schema
}
