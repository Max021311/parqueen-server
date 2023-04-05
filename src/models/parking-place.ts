'use strict'
import { Model, Sequelize, DataTypes } from 'sequelize'
import { Models } from '.'

const parkingTypeEnum = ['normal', 'big', 'worker', 'special'] as const

interface ParkingPlace {
  id: number
  type: typeof parkingTypeEnum[number]
  isActive: boolean
}

export class ParkingPlaceModel extends Model<ParkingPlace, Omit<ParkingPlace, 'id' | 'entryDate' | 'departureDate'>> {
  static associate (models: Models) {
    ParkingPlaceModel.hasMany(models.TicketModel, {
      foreignKey: 'parking_place_id',
      as: 'tickets'
    })
  }
}

export default function (sequelize: Sequelize) {
  ParkingPlaceModel.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM,
      values: parkingTypeEnum,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    createdAt: false,
    updatedAt: false,
    sequelize,
    modelName: 'parking_places'
  })

  return ParkingPlaceModel
};
