'use strict'
const audioTasks = require('../utils/constants').audioTasks
const audiosBaseUrl = require('../utils/constants').audiosBaseUrl
const loadAudiosInfo = require('../utils/audios_info')

const comparisonAudiosInfo = loadAudiosInfo.comparisonTest

const audios = []

// Comparison test
for (const audioInfo of comparisonAudiosInfo) {
  audios.push({
    id: audioInfo.id,
    src: audiosBaseUrl + audioInfo.name,
    task: audioTasks.comparisonTest.id
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert('Audios', audios, {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
    return queryInterface.bulkDelete('Audios', null, {})
  }
}
