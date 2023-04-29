'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
      },
      last_name: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
      },
      email: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
      },
      password: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
      }
    })
  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.dropTable('users')
  }
}
