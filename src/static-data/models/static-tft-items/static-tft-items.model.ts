import * as mongoose from 'mongoose'
import { ModelsOptions, ModelsName } from '../../../enums/database.enum'
import { IModels } from '../../../database/database.types'
// Schema definition
const schema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },

  name: {
    type: String,
    required: true
  }
}, ModelsOptions)

// Model definition
export const StaticTftModel: IModels = {
  name: ModelsName.STATIC_TFT_ITEM,
  collection: ModelsName.STATIC_TFT_ITEM,
  schema: schema
}
