'use strict'
const placeTypeEnum = ['normal', 'big', 'worker', 'special']

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('parking_places', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      slug: {
        allowNull: false,
        type: Sequelize.TEXT,
        unique: true
      },
      type: {
        type: Sequelize.ENUM(...placeTypeEnum),
        values: placeTypeEnum,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      position: {
        type: Sequelize.GEOMETRY('POINT', 0),
        allowNull: false
      }
    })
  },
  async down (queryInterface) {
    await queryInterface.dropTable('parking_places')
  }
}
