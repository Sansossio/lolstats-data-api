import { Test, TestingModule } from '@nestjs/testing'
import { CacheService } from './cache.service'
import { stub, restore } from 'sinon'
import { InternalServerErrorException } from '@nestjs/common'
import * as _ from 'lodash'
import { ConfigService } from '../config/config.service'
import * as utils from './cache.utils'

describe('CacheService', () => {
  let service: CacheService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheService]
    }).compile()

    service = module.get<CacheService>(CacheService)
  })

  function forceAvailable (service, connected = true) {
    service.client = service.client || {}
    service.client.connected = connected
  }

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should show log when client is disable', async () => {
    let passByLogger = false
    stub(ConfigService.prototype, 'getBoolean')
      .onFirstCall()
      .returns(false)
    stub(utils, 'serviceDisabled')
      .callsFake(() => {
        passByLogger = true
      })
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheService]
    }).compile()
    service = module.get<CacheService>(CacheService)
    const available = utils.redisIsAvailable(_.get(service, 'client'))
    expect(available).toEqual(false)
    expect(passByLogger).toEqual(true)
    restore()
  })

  describe('Get', () => {
    it('should return mocked value', async () => {
      stub(service as any, 'getClient')
        .callsFake(() => ({
          get: (key: string, cb: Function) => {
            cb(null, key)
          }
        }))
      forceAvailable(service)
      const key = '123'
      const response = await service.get(key)
      expect(response).toEqual(+key)
      restore()
    })

    it('should return undefined when service is disabled', async () => {
      stub(service as any, 'getClient')
        .callsFake(() => ({
          get: (key: string, cb: Function) => {
            cb(null, key)
          }
        }))
      forceAvailable(service, false)
      const key = '123'
      const response = await service.get(key)
      expect(response).toEqual(undefined)
      restore()
    })

    it('should catch error when client return error', done => {
      stub(service as any, 'getClient')
        .callsFake(() => ({
          get: (_, cb: Function) => {
            cb(new InternalServerErrorException())
          }
        }))
      forceAvailable(service)
      const key = '123'
      service.get(key)
        .then(() => done(new Error('Bad response')))
        .catch((e) => {
          expect(e).toBeInstanceOf(InternalServerErrorException)
          done()
        })
        .finally(() => restore())
    })
  })

  describe('Set', () => {
    it('should set a value', async () => {
      const storage: any = {}
      stub(service as any, 'getClient')
        .callsFake(() => ({
          setex: (key: string, expiration: number, value: any, cb: Function) => {
            storage[key] = {
              value,
              expiration
            }
            cb()
          }
        }))
      forceAvailable(service)
      const key = '123'
      await service.set(key, 123)
      expect(storage[key].value).toEqual('123')
      restore()
    })

    it('should set a value with expiration', async () => {
      const storage: any = {}
      stub(service as any, 'getClient')
        .callsFake(() => ({
          setex: (key: string, expiration: number, value: any, cb: Function) => {
            storage[key] = {
              value,
              expiration
            }
            cb()
          }
        }))
      forceAvailable(service)
      const key = '123'
      await service.set(key, 123, 1)
      expect(storage[key].value).toEqual('123')
      expect(storage[key].expiration).toEqual(1)
      restore()
    })

    it('should doesn\'t set a value when response error', done => {
      const storage: any = {}
      stub(service as any, 'getClient')
        .callsFake(() => ({
          setex: (key: string, expiration: number, value: any, cb: Function) => {
            cb(new Error())
          }
        }))
      forceAvailable(service)
      const key = '123'
      service.set(key, 123)
        .then(() => done(new Error('error expected')))
        .catch(() => {
          expect(storage[key]).toEqual(undefined)
          done()
        })
        .finally(() => restore())
    })

    it('should doesn\'t set a value when redis is disable', done => {
      const storage: any = {}
      stub(service as any, 'getClient')
        .callsFake(() => ({
          setex: (key: string, expiration: number, value: any, cb: Function) => {
            storage[key] = {
              value,
              expiration
            }
            cb()
          }
        }))
      forceAvailable(service, false)
      const key = '123'
      service.set(key, 123)
        .then(() => {
          expect(storage[key]).toEqual(undefined)
          done()
        })
        .catch(done)
        .finally(() => restore())
    })
  })

  describe('Get client', () => {
    it('should return client', () => {
      forceAvailable(service)
      const client = _.get(service, 'getClient').bind(service)()
      expect(client).toBeDefined()
    })
  })
})
