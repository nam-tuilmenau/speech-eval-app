'use strict'
const trappingsInfo = require('../utils/audios_info').trapping

const answers = []

// Gold standard
for (const audioInfo of trappingsInfo) {
  answers.push({
    AudioId: audioInfo.name,
    answers: JSON.stringify([audioInfo.answer])
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert('AudioQuestions', answers, {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
    return queryInterface.bulkDelete('AudioQuestions', null, {})
  }
}
