import type { FastifyPluginCallback } from 'fastify'
import models from './../models'
import { col, fn, Op } from 'sequelize'
import { ServiceUnavailable, BadRequest, Conflict } from 'http-errors'
import { PARKING_PLACE_TYPES } from './../constants/parking-places-type'
import { verifyTerminalToken, verifyToken } from './../pre-handler/auth'
import { CreateParkingPlace } from './../models/parking-place'

const parkingPlaceRoutePlugin: FastifyPluginCallback = (instance, _opts, done) => {
  instance.route<{
    Body: {
      position: [number, number],
      type: typeof PARKING_PLACE_TYPES[number]
    }
  }>({
    method: 'POST',
    url: '/assign-parking-place',
    schema: {
      headers: {
        type: 'object',
        properties: {
          Authorization: {
            type: 'string',
            description: 'Token of the terminal'
          }
        },
        required: ['Authorization']
      },
      body: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: PARKING_PLACE_TYPES
          }
        },
        required: ['type'],
        additionalProperties: false
      }
    },
    preHandler: verifyTerminalToken,
    async handler (request, reply) {
      const { coordinates: [x, y] } = request.terminal.position
      const type = request.body.type

      const parkingPlace = await models.ParkingPlaceModel.findOne({
        order: [
          [
            fn('ST_Distance', col('position'), fn('ST_MakePoint', x, y)),
            'ASC'
          ]
        ],
        where: {
          isActive: true,
          type,
          [Op.or]: [
            { '$tickets.id$': null },
            { '$tickets.departure_date$': { [Op.not]: null } }
          ]
        },
        include: [{
          association: 'tickets',
          where: {
            departure_date: null
          },
          required: false
        }],
        subQuery: false
      })

      if (parkingPlace === null) {
        throw new ServiceUnavailable(`Parking places of type ${type} not available`)
      }

      const ticket = await models.TicketModel.create({
        entry_date: new Date(),
        parking_place_id: parkingPlace.id
      })

      reply.code(201).send({
        ...ticket.toJSON(),
        parking_place: parkingPlace.toJSON()
      })
    }
  })

  instance.route({
    method: 'GET',
    url: '/parking-places',
    preHandler: verifyToken,
    async handler (_request, reply) {
      const parkingPlaces = await models.ParkingPlaceModel.findAll({
        order: [
          ['slug', 'ASC']
        ],
        include: [{
          association: 'tickets',
          where: {
            departure_date: null
          },
          required: false
        }],
        subQuery: false
      })
      await reply.code(200).send(parkingPlaces)
    }
  })

  instance.route<{
    Params: { id: number }
    Body: Partial<CreateParkingPlace>
  }>({
    method: 'PUT',
    url: '/parking-place/:id',
    schema: {
      headers: {
        type: 'object',
        properties: {
          Authorization: {
            type: 'string',
            description: 'Token of the terminal'
          }
        },
        required: ['Authorization']
      },
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          position: {
            type: 'object',
            properties: {
              type: { const: 'Point' },
              coordinates: {
                type: 'array',
                items: { type: 'number' },
                minItems: 2,
                maxItems: 2
              }
            },
            required: ['type', 'coordinates']
          },
          type: {
            type: 'string',
            enum: PARKING_PLACE_TYPES
          },
          isActive: { type: 'boolean' }
        }
      }
    },
    preHandler: verifyToken,
    async handler (request, reply) {
      const body = request.body
      const [affectedCount] = await models.ParkingPlaceModel.update(body, {
        where: {
          id: request.params.id
        }
      })
      reply.code(200).send({ affectedCount })
    }
  })

  instance.route<{
    Params: { id: number }
  }>({
    method: 'POST',
    url: '/ticket/:id/register-exit',
    schema: {
      headers: {
        type: 'object',
        properties: {
          Authorization: {
            type: 'string',
            description: 'Token of the terminal'
          }
        },
        required: ['Authorization']
      },
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' }
        },
        required: ['id']
      }
    },
    preHandler: verifyTerminalToken,
    async handler (request, reply) {
      const ticket = await models.TicketModel.findByPk(request.params.id)
      if (ticket === null) {
        throw BadRequest('Unknow ID')
      }
      if (ticket.departure_date !== null) {
        throw Conflict('Departure date already defined')
      }
      ticket.departure_date = new Date()
      await ticket.save()
      reply.code(200).send(ticket.toJSON())
    }
  })

  done()
}

export default parkingPlaceRoutePlugin
