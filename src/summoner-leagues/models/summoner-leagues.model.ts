import * as mongoose from 'mongoose'
import { ModelsName, ModelsOptions } from '../../database/database.enum'
import { IModels } from '../../database/database.types'

// Schema definition
const schema = new mongoose.Schema({
  queueType: {
    type: String,
    required: true
  },

  summonerName: {
    type: String,
    required: true
  },

  hotStreak: {
    type: Boolean,
    required: true
  },

  wins: {
    type: Number,
    required: true
  },

  veteran: {
    type: Boolean,
    required: true
  },

  losses: {
    type: Number,
    required: true
  },

  rank: {
    type: Number,
    required: true
  },

  leagueId: {
    type: String,
    required: true
  },

  inactive: {
    type: Boolean,
    required: true
  },

  freshBlood: {
    type: Boolean,
    required: true
  },

  tier: {
    type: String,
    required: true
  },

  summonerId: {
    type: String,
    required: true
  },

  leaguePoints: {
    type: Number,
    required: true
  },

  summoner: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  }
}, ModelsOptions)

// Model definition
export const SummonerLeagueModel: IModels = {
  name: ModelsName.SUMMONER_LEAGUES,
  collection: ModelsName.SUMMONER_LEAGUES,
  schema: schema
}
