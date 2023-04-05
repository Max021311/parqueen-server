'use strict'
import * as Sequelize from 'sequelize'
import config from './../config/db.mjs'
import buildTicketModel from './ticket'
import buildParkingPlaceModel from './parking-place'

const sequelize = new Sequelize.Sequelize(config)

const db = {
  sequelize: sequelize,
  Sequelize: Sequelize,
  TicketModel: buildTicketModel(sequelize),
  ParkingPlaceModel: buildParkingPlaceModel(sequelize)
}

export type Models = typeof db
export type ModelsKeys = keyof Models

(Object.keys(db) as ModelsKeys[]).forEach(modelName => {
  const model = db[modelName]
  if ('associate' in model) {
    model.associate(db)
  }
})

export default db
