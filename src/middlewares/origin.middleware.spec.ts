import { OriginMiddleware } from './origin.middleware'
import { OriginAcceptedEnum } from '../enums/origin.enum'
import { ForbiddenException } from '@nestjs/common'

describe('Origin middleware', () => {
  let middleware: OriginMiddleware
  const res: any = {}
  // tslint:disable-next-line
  const next = () => {}

  beforeAll(() => {
    middleware = new OriginMiddleware()
  })

  it('should continue when is localhost', () => {
    const req: any = {
      headers: {},
      hostname: 'localhost'
    }
    middleware.use(req, res, next)
  })

  it('should continue when is an acceptance host', () => {
    const req: any = {
      headers: {
        referer: OriginAcceptedEnum.ACCEPTANCE_HOST
      },
      hostname: 'google.com'
    }
    middleware.use(req, res, next)
  })

  it('should return error', done => {
    const req: any = {
      headers: {},
      hostname: 'google.com'
    }
    try {
      middleware.use(req, res, next)
      done(new Error())
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenException)
      done()
    }
  })
})
