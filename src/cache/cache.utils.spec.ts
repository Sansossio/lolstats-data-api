import * as utils from './cache.utils'
import { stub, restore } from 'sinon'
import { Logger } from '@nestjs/common'
import { version } from '../../package.json'

describe('Cache utils', () => {
  it('should return valid log', () => {
    stub(Logger, 'warn')
      .callsFake((message, context) => {
        return `[${context}] ${message}`
      })
    const response = utils.serviceDisabled()
    expect(typeof response).toEqual('string')
    restore()
  })

  it('should return valid key', () => {
    const className = 'className'
    const propertyName = 'propertyName'
    const args = ['a', 'b']

    const key = utils.generateKey(className, propertyName, args)
    const expected = `${version},${className},${propertyName},"a","b"`
    expect(key).toEqual(expected)
  })
})