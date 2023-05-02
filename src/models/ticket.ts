'use strict'
import { Model, Sequelize, DataTypes } from 'sequelize'
import type { Models } from '.'

interface Ticket {
  id: number
  entry_date: Date
  departure_date: Date
  parking_place_id: number
}

export class TicketModel extends Model<Ticket, Omit<Ticket, 'id' | 'departure_date'>> {
  static associate (models: Models) {
    TicketModel.belongsTo(models.ParkingPlaceModel, {
      foreignKey: 'parking_place_id',
      as: 'parking_place'
    })
  }
}

export default function (sequelize: Sequelize) {
  TicketModel.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    entry_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    departure_date: DataTypes.DATE,
    parking_place_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    createdAt: false,
    updatedAt: false,
    sequelize,
    modelName: 'tickets'
  })

  return TicketModel
};
