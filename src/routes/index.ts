import type { FastifyPluginCallback } from 'fastify'

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
  done()
}

export default routePlugin
