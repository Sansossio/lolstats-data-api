import * as mongoose from 'mongoose'
import { ModelsOptions } from '../../../../enums/database.enum'

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
