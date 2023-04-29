import models from './../models'
import AuthService from './auth'

const serviceParams = {
  models,
  config: {
    jwt: {
      secret: process.env.JWT_SECRET ?? 'loremipsum'
    }
  }
} as const

export type ServiceParams = typeof serviceParams

export const services = {
  auth: new AuthService(serviceParams)
}
