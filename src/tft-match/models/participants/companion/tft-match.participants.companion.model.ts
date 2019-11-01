import * as mongoose from 'mongoose'
import { ModelsOptions } from '../../../../database/database.enum'

// Schema definition
export const TftMatchParticipantsCompanionModel = new mongoose.Schema({
  content_ID: {
    type: String
  },

  skin_ID: {
    type: Number
  },

  species: {
    type: String
  }

}, ModelsOptions)
