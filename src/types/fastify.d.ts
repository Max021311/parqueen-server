import { UserModel } from './../models/user'

declare module 'fastify' {
  interface FastifyRequest {
    user: UserModel | null
  }
}
