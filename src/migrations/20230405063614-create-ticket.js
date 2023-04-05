'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      entry_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      departure_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      parking_place_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'parking_places',
          key: 'id'
        }
      }
    })
  },
  async down (queryInterface) {
    await queryInterface.dropTable('tickets')
  }
}
