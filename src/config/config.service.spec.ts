import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from './config.service'

describe('ConfigService', () => {
  let service: ConfigService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService]
    }).compile()
    service = module.get<ConfigService>(ConfigService)
  })

  it('should be defined', () => {
    const value = service
    expect(value).toBeInstanceOf(ConfigService)
  })

  it('should return a simple test', () => {
    const value = typeof service.get('riot.apiKey')
    expect(value).toEqual('string')
  })

  it('should return a boolean', () => {
    const value = service.getBoolean('-')
    expect(value).toEqual(false)
  })

  it('should return false', () => {
    const value = service.getBoolean('false')
    expect(value).toEqual(false)
  })

  it('should return a true', () => {
    const value = service.getBoolean('true')
    expect(value).toEqual(true)
  })

  it('should return a number', () => {
    const value = typeof service.getNumber('-')
    expect(value).toEqual('number')
  })

  it('should return a NaN', () => {
    const value = service.getNumber('a')
    expect(value).toBeNaN()
  })

  it('should return a specific number', () => {
    const n = 10
    const value = service.getNumber(n.toString())
    expect(value).toEqual(n)
  })

  it('should return a specific number (negative)', () => {
    const n = -10
    const value = service.getNumber(n.toString())
    expect(value).toEqual(n)
  })
})
