'use strict'
import { Model, Sequelize, DataTypes } from 'sequelize'

interface User {
  id: number
  name: string
  last_name: string
  email: string
  password: string
}

export class UserModel extends Model<User, Omit<User, 'id'>> {
  // static associate (models: Models) {
  // }
}

export default function (sequelize: Sequelize) {
  UserModel.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    last_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    createdAt: false,
    updatedAt: false,
    sequelize,
    modelName: 'users'
  })

  return UserModel
};
