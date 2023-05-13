import type { FastifyPluginCallback } from 'fastify'
import authRoutePlugin from './auth'
import parkingPlaceRoutePlugin from './parking-places'

const routePlugin: FastifyPluginCallback = (instance, _opts, done) => {
  instance.route({
    method: 'GET',
    url: '/ok',
    async handler (request, reply) {
      const { body } = request
      console.log({ body })
      return reply.code(200).send('ok')
    }
  })

  instance.register(authRoutePlugin)
  instance.register(parkingPlaceRoutePlugin)

  done()
}

export default routePlugin
