'use strict'
const audioTasks = require('../utils/constants').audioTasks
const audiosBaseUrl = require('../utils/constants').audiosBaseUrl
const loadAudiosInfo = require('../utils/audios_info')

const trappingsInfo = loadAudiosInfo.trapping

const audios = []

// Rating
for (const audioInfo of trappingsInfo) {
  audios.push({
    id: audioInfo.name,
    src: audiosBaseUrl + audioInfo.name,
    task: audioTasks.trappingQuestion.id
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
