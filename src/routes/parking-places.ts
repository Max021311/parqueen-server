import type { FastifyPluginCallback } from 'fastify'
import models from './../models'
import { col, fn, Op } from 'sequelize'
import { ServiceUnavailable } from 'http-errors'
import { PARKING_PLACE_TYPES } from './../constants/parking-places-type'

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
      // TODO: Implement tokens for terminals
      // headers: {
      //   type: 'object',
      //   properties: {
      //     Authorization: {
      //       type: 'string',
      //       description: 'Token of the terminal'
      //     }
      //   },
      //   required: ['Authorization']
      // },
      body: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: PARKING_PLACE_TYPES
          },
          position: {
            type: 'array',
            items: {
              type: 'integer',
              minimum: 0
            },
            maxItems: 2,
            minItems: 2
          },
        },
        required: ['position', 'type'],
        additionalProperties: false
      }
    },
    async handler (request, reply) {
      const [x, y] = request.body.position
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

      reply.code(201).send(ticket.toJSON())
    }
  })

  done()
}

export default parkingPlaceRoutePlugin
