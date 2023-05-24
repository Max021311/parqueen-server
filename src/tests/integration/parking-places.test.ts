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
    const payload = {
      type: 'normal'
    }
    const res = await app.inject({
      method: 'POST',
      url: '/assign-parking-place',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer ' + token
      },
      payload
    })
    const ticket = res.json()
    app.log.debug({ request: payload, response: ticket })
    assert.property(ticket, 'id')
    assert.isNumber(ticket.id)
    assert.property(ticket, 'parking_place')
    assert.isObject(ticket.parking_place)
  })

  it('Assign parking place and register exit of ticket', async () => {
    const payload = {
      type: 'normal'
    }
    const resAssignParking = await app.inject({
      method: 'POST',
      url: '/assign-parking-place',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer ' + token
      },
      payload
    })

    const ticket = resAssignParking.json()
    app.log.debug({ request: payload, response: ticket })
    assert.property(ticket, 'id')
    assert.isNumber(ticket.id)
    assert.property(ticket, 'parking_place')
    assert.isObject(ticket.parking_place)
    assert.property(ticket, 'departure_date')
    assert.isNull(ticket.departure_date)

    const resTicketExit = await app.inject({
      method: 'POST',
      url: `/ticket/${ticket.id}/register-exit`,
      headers: {
        authorization: 'Bearer ' + token
      }
    })

    const updatedTicket = resTicketExit.json()
    app.log.debug({ response: updatedTicket })
    assert.property(updatedTicket, 'id')
    assert.property(updatedTicket, 'departure_date')
    assert.isNotNull(updatedTicket.departure_date)
  })

  it('Assign parking place - full capacity', async () => {
    const payload = {
      type: 'special'
    }

    async function makeRequest () {
      return app.inject({
        method: 'POST',
        url: '/assign-parking-place',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer ' + token
        },
        payload
      })
    }

    await makeRequest()

    const res = await makeRequest()
    assert.equal(res.statusCode, 503)
    const response = res.json()
    app.log.debug({ request: payload, response })
    assert.equal(response.message, 'Parking places of type special not available')
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
    app.log.debug({ response: parkingPlaces })
    assert.isArray(parkingPlaces)
    assert.isObject(parkingPlaces[0])
    assert.property(parkingPlaces[0], 'id')
    assert.property(parkingPlaces[0], 'tickets')
  })
})
