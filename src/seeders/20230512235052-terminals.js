'use strict'
const TERMINALS = require('./../mocks/terminals.json')
const sequelize = require('sequelize')

const terminals = TERMINALS
  .map(p => {
    return {
      ...p,
      position: sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify(p.position))
    }
  })

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('terminals', terminals)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('terminals', {})
  }
}
