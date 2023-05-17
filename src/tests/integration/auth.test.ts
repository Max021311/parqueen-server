import build from './../../build'
import { assert } from 'chai'
import { describe, before, it } from 'mocha'

describe('Auth API', () => {
  const app = build()
  before(async () => {
    await app.ready()
  })

  it('Login and authenticate token', async () => {
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/auth',
      payload: {
        email: 'example@example.com',
        password: 'loremipsum'
      }
    })

    assert.strictEqual(loginResponse.statusCode, 200)
    const token = loginResponse.json().token as string
    assert.isString(token)

    const authResponse = await app.inject({
      method: 'GET',
      url: '/auth',
      headers: {
        authorization: 'Bearer ' + token
      }
    })

    assert.strictEqual(authResponse.statusCode, 200)
    assert.strictEqual(authResponse.payload, 'ok')
  })
})
