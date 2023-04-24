'use strict'
const { hash } = require('bcrypt')
const salts = parseInt(process.env.SALT_ROUNDS ?? '13')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        name: 'Juan',
        last_name: 'Perez',
        email: 'example@example.com',
        password: await hash('loremipsum', salts)
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {})
  }
}
