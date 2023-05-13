'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('terminals', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
      },
      position: {
        type: Sequelize.GEOMETRY('POINT', 0),
        allowNull: false
      }
    })
  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.dropTable('terminals')
  }
}
