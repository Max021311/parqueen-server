import type { FastifyPluginCallback } from 'fastify'
import authRoutePlugin from './auth'

const routePlugin: FastifyPluginCallback = (instance, _opts, done) => {
  instance.route({
    method: 'GET',
    url: '/ok',
    handler (request, reply) {
      const { body } = request
      console.log({ body })
      return reply.code(200).send('ok')
    }
  })

  instance.register(authRoutePlugin)

  done()
}

export default routePlugin
