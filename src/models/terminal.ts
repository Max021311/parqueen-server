'use strict'
import {
  Model,
  Sequelize,
  DataTypes,
  InferAttributes,
  InferCreationAttributes
} from 'sequelize'

/* eslint-disable no-use-before-define */
export class TerminalModel extends Model<
  InferAttributes<TerminalModel>,
  InferCreationAttributes<TerminalModel, { omit: 'id' }>
> {
  declare id: number
  declare name: string
  declare position: { type: 'Point', coordinates: [number, number] }

  // static associate (models: Models) {
  // }
}
/* eslint-enable no-use-before-define */

export default function (sequelize: Sequelize) {
  TerminalModel.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    position: {
      type: DataTypes.GEOMETRY('POINT', 0),
      allowNull: false
    }
  }, {
    createdAt: false,
    updatedAt: false,
    sequelize,
    modelName: 'terminals'
  })

  return TerminalModel
};
