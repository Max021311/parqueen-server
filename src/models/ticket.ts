'use strict'
import {
  Model,
  Sequelize,
  DataTypes,
  NonAttribute,
  Association,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin
} from 'sequelize'
import type { Models } from '.'
import type { ParkingPlaceModel } from './parking-place'

/* eslint-disable no-use-before-define */
export class TicketModel extends Model<
  InferAttributes<TicketModel>,
  InferCreationAttributes<TicketModel, { omit: 'id' | 'departure_date' }>
  > {
  declare id: number
  declare entry_date: Date
  declare departure_date: Date
  declare parking_place_id: number

  declare parking_place?: NonAttribute<ParkingPlaceModel>
  declare public static associations: { projects: Association<TicketModel, ParkingPlaceModel> }

  static associate (models: Models) {
    TicketModel.belongsTo(models.ParkingPlaceModel, {
      foreignKey: 'parking_place_id',
      as: 'parking_place'
    })
  }
}
/* eslint-enable no-use-before-define */

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
