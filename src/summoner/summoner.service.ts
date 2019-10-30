import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ModelsEnum } from '../database/database.enum'
import { ISummonerModel } from './models/summoner.interface'

@Injectable()
export class SummonerService {
  constructor (
    @InjectModel(ModelsEnum.SUMMONER.name) private readonly repository: Model<ISummonerModel>
  ) {}

  create () {
    return this.repository.create({})
  }

  get () {
    return this.repository.find()
  }
}
