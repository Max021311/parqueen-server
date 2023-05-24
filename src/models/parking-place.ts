'use strict'
import {
  Model,
  Sequelize,
  DataTypes,
  NonAttribute,
  InferAttributes,
  InferCreationAttributes,
  Association
} from 'sequelize'
import { Models } from '.'
import { TicketModel } from './ticket'
import { PARKING_PLACE_TYPES } from './../constants/parking-places-type'

/* eslint-disable no-use-before-define */
export type CreateParkingPlace = InferCreationAttributes<ParkingPlaceModel, { omit: 'id' | 'tickets' }>

export class ParkingPlaceModel extends Model<
  InferAttributes<ParkingPlaceModel, { omit: 'tickets' }>,
  CreateParkingPlace
> {
  declare id: number
  declare slug: string
  declare position: { type: 'Point', coordinates: [number, number] }
  declare type: typeof PARKING_PLACE_TYPES[number]
  declare isActive: boolean

  declare tickets?: NonAttribute<TicketModel>

  declare public static associations: { projects: Association<ParkingPlaceModel, TicketModel> }

  static associate (models: Models) {
    ParkingPlaceModel.hasMany(models.TicketModel, {
      foreignKey: 'parking_place_id',
      as: 'tickets'
    })
  }
}
/* eslint-enable no-use-before-define */

export default function (sequelize: Sequelize) {
  ParkingPlaceModel.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    slug: {
      allowNull: false,
      type: DataTypes.TEXT,
      unique: true
    },
    type: {
      type: DataTypes.ENUM,
      values: PARKING_PLACE_TYPES,
      allowNull: false
    },
    position: {
      type: DataTypes.GEOMETRY('POINT')
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
