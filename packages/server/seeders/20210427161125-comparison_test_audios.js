'use strict'
const loadAudiosInfo = require('../utils/audios_info')

const comparisonAudiosInfo = loadAudiosInfo.comparisonTest

const audios = []

// Comparison test
for (const audioInfo of comparisonAudiosInfo) {
  audios.push({
    AudioId: audioInfo.id,
    type: audioInfo.type
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert('ComparisonAudios', audios, {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
    return queryInterface.bulkDelete('ComparisonAudios', null, {})
  }
}
