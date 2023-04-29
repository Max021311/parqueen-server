import type { FastifyPluginCallback } from 'fastify'
import models from './../models'
import { services } from './../service'
import { Unauthorized } from 'http-errors'

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
        throw Unauthorized('Unauthorized')
      }

      const isSame = await services.auth.compare(password, user.getDataValue('password'))

      if (!isSame) {
        throw Unauthorized('Unauthorized')
      }

      const token = await services.auth.createToken(user.getDataValue('id'))
      await reply.code(200).send({ token })
    }
  })

  done()
}

export default authRoutePlugin
