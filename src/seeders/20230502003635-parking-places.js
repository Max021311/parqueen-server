'use strict'
const PARKING_PLACES = require('./../mocks/parking_places.json')
const sequelize = require('sequelize')

const parkingPlaces = PARKING_PLACES
  .map(p => {
    return {
      ...p,
      position: sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify(p.position))
    }
  })

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, _Sequelize) {
    await queryInterface.bulkInsert('parking_places', parkingPlaces)
  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('parking_places', {})
  }
}
