import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DBConnection } from '../enum/database-connection.enum'
import { Repository } from 'typeorm'
import { SummonerContextEntity } from './summoner.entity'

@Injectable()
export class SummonerRepositories {
  constructor (
    @InjectRepository(SummonerContextEntity, DBConnection.CONTEXT)
    readonly summoner: Repository<SummonerContextEntity>
  ) {}
}
