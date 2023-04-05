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
      type: {
        type: Sequelize.ENUM(...placeTypeEnum),
        values: placeTypeEnum,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    })
  },
  async down (queryInterface) {
    await queryInterface.dropTable('parking_places')
  }
}
