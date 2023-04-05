import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import routes from './routes'
import db from './models'

export default function build (opts?: { prefix?: string }) {
  const app = fastify({
    logger: process.env.LOGS_DISABLED === '1' ? false : {
      level: process.env.LOG_LEVEL || 'debug'
    }
  })
  app.register(fastifyCors)
  app.register(routes, { prefix: opts?.prefix })
  return app
}
