'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tickets', {
      id: {
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
    
    /**
     * ```sql
     * CREATE INDEX tickets_parking_place_id ON tickets (parking_place_id) WHERE (departure_date IS NULL)
     * ```
     */
    await queryInterface.addIndex('tickets', {
      fields: ['parking_place_id'],
      where: {
        departure_date: null
      },
      unique: true
    })
  },
  async down (queryInterface) {
    await queryInterface.dropTable('tickets')
  }
}
