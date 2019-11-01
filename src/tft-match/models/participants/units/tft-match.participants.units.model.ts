import * as mongoose from 'mongoose'
import { ModelsOptions, ModelsName } from '../../../../database/database.enum'

// Schema definition
export const TftMatchParticipantsUnitsModel = new mongoose.Schema({
  tier: {
    type: Number,
    required: true
  },

  items: {
    type: [Number],
    required: true
  },

  character_id: {
    type: String,
    required: false,
    default: ''
  },

  name: {
    type: String,
    required: true
  },

  rarity: {
    type: Number,
    required: false,
    default: 0
  }
}, ModelsOptions)
