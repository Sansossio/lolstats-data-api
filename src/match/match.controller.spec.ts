import { Test, TestingModule } from '@nestjs/testing'
import { MatchController } from './match.controller'
import { getRepositoryToken } from '@nestjs/typeorm'
import { MatchEntity } from './entities/match.entity'
import { DBConnection } from '../enum/database-connection.enum'
import { Repository } from 'typeorm'
import { MatchService } from './match.service'

describe('Match Controller', () => {
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(MatchEntity, DBConnection.CONTEXT),
          useClass: Repository
        },
        MatchService
      ],
      controllers: [MatchController]
    }).compile()
  })
  it('should be defined', () => {
    const controller: MatchController = module.get<MatchController>(MatchController)
    expect(controller).toBeDefined()
  })
})
