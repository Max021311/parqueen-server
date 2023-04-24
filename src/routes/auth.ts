import type { FastifyPluginCallback } from 'fastify'
import models from './../models'
import { compare } from 'bcrypt'

const authRoutePlugin: FastifyPluginCallback = (instance, _opts, done) => {
  interface AuthBody {
    email: string,
    password: string
  }

  instance.route<{
    Body: AuthBody
  }>({
    method: 'POST',
    url: '/auth',
    schema: {
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 }
        },
        required: ['email', 'password']
      }
    },
    async handler (request, reply) {
      const { email, password } = request.body
      const user = await models.UserModel.findOne({ where: { email } })
      if (user === null) {
        reply.code(401).send('Unauthorized')
        return
      }

      const isSame = await compare(password, user.getDataValue('password'))

      if (!isSame) {
        reply.code(401).send('Unauthorized')
        return
      }

      reply.code(200).send()
    }
  })
  done()
}

export default authRoutePlugin
