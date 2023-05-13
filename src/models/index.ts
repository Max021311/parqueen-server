'use strict'
import * as Sequelize from 'sequelize'
import config from './../config/db.js'
import buildTicketModel from './ticket'
import buildParkingPlaceModel from './parking-place'
import buildUserModel from './user'
import buildTerminalModel from './terminal'

const sequelize = new Sequelize.Sequelize(config)

const db = {
  sequelize: sequelize,
  Sequelize: Sequelize,
  TicketModel: buildTicketModel(sequelize),
  ParkingPlaceModel: buildParkingPlaceModel(sequelize),
  UserModel: buildUserModel(sequelize),
  TerminalModel: buildTerminalModel(sequelize)
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
