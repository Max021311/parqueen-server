import build from './../../build'
import { assert } from 'chai'
import { describe, before, it } from 'mocha'

describe('Auth API', () => {
  const app = build()
  before(async () => {
    await app.ready()
  })

  it('Login and authenticate token', async () => {
    const payload = {
      email: 'example@example.com',
      password: 'loremipsum'
    }

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/auth',
      payload
    })

    assert.strictEqual(loginResponse.statusCode, 200)
    const token = loginResponse.json().token as string
    assert.isString(token)
    app.log.debug({ request: payload, response: { token } })

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
  it('Invalid email', async () => {
    const payload = {
      email: 'example*example.com',
      password: 'loremipsum'
    }

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/auth',
      payload
    })

    assert.strictEqual(loginResponse.statusCode, 400)
    const response = loginResponse.json()
    assert.strictEqual(response.message, 'body/email must match format "email"')
    app.log.debug({ request: payload, response })
  })
  it('Invalid password - too short', async () => {
    const payload = {
      email: 'example@example.com',
      password: 'lorem'
    }

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/auth',
      payload
    })

    assert.strictEqual(loginResponse.statusCode, 400)
    const response = loginResponse.json()
    assert.strictEqual(response.message, 'body/password must NOT have fewer than 8 characters')
    app.log.debug({ request: payload, response })
  })
  it('Unauthorized', async () => {
    const payload = {
      email: 'example@example.com',
      password: 'asjflasjdlfjasldjflajsl'
    }

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/auth',
      payload
    })

    assert.strictEqual(loginResponse.statusCode, 401)
    const response = loginResponse.json()
    assert.strictEqual(response.message, 'Unauthorized')
    app.log.debug({ request: payload, response })
  })
})
