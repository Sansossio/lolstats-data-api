import * as mongoose from 'mongoose'
import { ModelsOptions, ModelsName } from '../../../enums/database.enum'
import { IModels } from '../../../database/database.types'
// Schema definition
const schema = new mongoose.Schema({
  mapId: {
    type: String,
    required: true
  },

  mapName: {
    type: String,
    required: true
  },

  notes: {
    type: String,
    required: false,
    default: null
  }
}, ModelsOptions)

// Model definition
export const MapsModel: IModels = {
  name: ModelsName.STATIC_MAPS,
  collection: ModelsName.STATIC_MAPS,
  schema: schema
}
