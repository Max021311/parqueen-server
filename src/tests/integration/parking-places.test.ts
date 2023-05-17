import build from './../../build'
import { assert } from 'chai'
import { before, describe, it } from 'mocha'
import { sign } from 'jsonwebtoken'

const token = sign({ id: 1, scope: 'terminal' }, process.env.JWT_SECRET ?? 'loremipsum', { expiresIn: '5m' })

describe('Parking places API', () => {
  const app = build()
  before(async () => {
    await app.ready()
  })

  it('Assign parking place', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/assign-parking-place',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer ' + token
      },
      payload: {
        type: 'normal',
        position: [2, 1]
      }
    })
    const ticket = res.json()
    assert.property(ticket, 'id')
    assert.isNumber(ticket.id)
    assert.property(ticket, 'parking_place')
    assert.isObject(ticket.parking_place)
  })

  it('List parking places', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/parking-places',
      headers: {
        authorization: 'Bearer ' + token
      }
    })
    const parkingPlaces = res.json()
    assert.isArray(parkingPlaces)
    assert.isObject(parkingPlaces[0])
    assert.property(parkingPlaces[0], 'id')
    assert.property(parkingPlaces[0], 'tickets')
  })
})
