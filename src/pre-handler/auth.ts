import { preHandlerAsyncHookHandler } from 'fastify'
import { Unauthorized, BadRequest } from 'http-errors'
import { services } from './../service'
import models from './../models'
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'

export const verifyToken: preHandlerAsyncHookHandler = async function verifyToken (request) {
  const authorization = request.headers.authorization
  if (typeof authorization !== 'string') {
    throw new Unauthorized('Missing authorization header or must be string')
  }
  const [type, token] = authorization.split(' ')
  if (type !== 'Bearer') {
    throw new BadRequest('Bad token scheme')
  }

  try {
    const payload = await services.auth.verifyToken(token)
    if (typeof payload === 'undefined') { throw new BadRequest('Bad token') }
    if (typeof payload === 'string') { throw new BadRequest('Bad token') }
    if (typeof payload.id !== 'number') { throw new BadRequest('Bad token') }

    const id = payload.id
    const user = await models.UserModel.findByPk(id, { attributes: ['id'] })
    if (user === null) { throw new Unauthorized() }
    request.user = user
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new Unauthorized(`Token expired at ${error.expiredAt.toISOString()}`)
    }
    if (error instanceof JsonWebTokenError) {
      throw new BadRequest('Bad token')
    }
    if (error instanceof NotBeforeError) {
      throw new Unauthorized(`Token active before ${error.date.toISOString()}`)
    }
    throw error
  }
}
